'use client';
import React, { useState } from 'react';
import {
  ColumnDef,
  PaginationState,
  SortingState,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Skeleton } from '@/components/ui/skeleton';
import AppTable from '@/components/AppTable';
import { ArrowUpDown, Pencil, XCircle, Trash, UserCheck } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import User from '@/types/User';
import { useDeleteUser, useUpdateUser, useUsers, useUpdateUserStatus } from '@/lib/UsersAPI';
import AppConfirmationDialog from './AppConfirmationDialog';
import { toast } from '@/components/ui/use-toast';
import AppUserForm from './AppUserForm';
import { useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';

export default function AppUsersTable() {
  const queryClient = useQueryClient();
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [searchKeyword, setSearchKeyword] = React.useState('');
  const [sorting, setSorting] = useState<SortingState>([]);
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const { data, isLoading } = useUsers(
    pageIndex + 1,
    pageSize,
    searchKeyword,
    sorting.map((item) => item.id).join(','),
    Boolean(sorting.map((item) => item.desc).join(','))
  );

  const { mutate: deleteUser } = useDeleteUser();
  const { mutate: updateUserStatus } = useUpdateUserStatus();
  const { mutate: updateUser } = useUpdateUser();

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditUserDialogOpen(true);
  };

  const handleDeleteUser = (id: string) => {
    deleteUser(id.toString(), {
      onSettled: () => {
        queryClient.invalidateQueries({
          queryKey: ['users']
        });
      }
    });
  };

  const handleApproveUser = (id: string) => {
    updateUserStatus({ id, status: 1 }, {
      onSettled: () => {
        queryClient.invalidateQueries({
          queryKey: ['users']
        });
      }
    });
  };

  const [rowSelection, setRowSelection] = useState({});
  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'image',
      header: 'Image',
      cell: ({ row }) => {
        const item = row.original;
        const image = item.image;

        let imageUrl = image;
        if (image) {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL;
          if (apiUrl) {
            imageUrl = `${apiUrl}/storage/app/public/image/${image}`;
          }
        }

        console.log("imageUrl", imageUrl);

        return imageUrl ? (
          <>
            <Image
              src={imageUrl}
              alt="User"
              width={80}
              height={80}
              className="h-20 w-20 cursor-pointer object-cover"
              onClick={() => {
                setSelectedImage(imageUrl ?? null);
                setIsImageDialogOpen(true);
              }}
            />

            <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
              <DialogContent className="absolute flex justify-center items-center">
                <button
                  onClick={() => setIsImageDialogOpen(false)}
                  className="absolute text-white p-2 rounded-full"
                />
                {selectedImage && (
                  <Image
                    src={selectedImage}
                    alt="Selected Image"
                    width={500}
                    height={500}
                    className="max-w-full max-h-full object-contain"
                  />
                )}
              </DialogContent>
            </Dialog>
          </>
        ) : (
          <div className="h-20 w-20 bg-gray-300" />
        );
      },
    },
    {
      accessorKey: 'first_name',
      header: ({ column }) => (
        <Button
          variant='ghost'
          className='pl-0 text-left hover:!bg-transparent'
          onClick={() => column.toggleSorting()}
        >
          Users' Name
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      ),
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div>
            {item.first_name} {item.last_name}
          </div>
        );
      },
      enableSorting: true,
    },
    {
      accessorKey: 'email',
      header: ({ column }) => (
        <Button
          variant='ghost'
          className='pl-0 text-left hover:!bg-transparent'
          onClick={() => column.toggleSorting()}
        >
          Email
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      ),
      cell: ({ row }) => {
        const item = row.original;
        return <div>{item.email}</div>;
      },
      enableSorting: true,
    },
    {
      accessorKey: 'phone',
      header: () => (
        <Button
          variant='ghost'
          className='pl-0 text-left hover:!bg-transparent'
        >
          Phone
        </Button>
      ),
      cell: ({ row }) => {
        const item = row.original;
        return <div>{item.phone}</div>;
      },
    },
    {
      accessorKey: 'address',
      header: () => (
        <Button
          variant='ghost'
          className='pl-0 text-left hover:!bg-transparent'
        >
          Address
        </Button>
      ),
      cell: ({ row }) => {
        const item = row.original;
        return <div>{item.address}</div>;
      },
    },
    {
      accessorKey: 'role',
      header: () => (
        <Button
          variant='ghost'
          className='pl-0 text-left hover:!bg-transparent'
        >
          Role
        </Button>
      ),
      cell: ({ row }) => {
        const item = row.original;
        return <div>{item.role.charAt(0).toUpperCase() + item.role.slice(1).toLowerCase()}</div>;
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div>
            {item.status == 1 && (
              <span className="text-green-500">Active</span>
            )}
          </div>
        );
      },
    },
    {
      id: 'actions',
      header: () => <div className='text-center'>Actions</div>,
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="flex justify-center items-center">
            <Dialog>
              {item.status == 0 && (
                <AppConfirmationDialog
                  title='Approve User'
                  description={`Are you sure you want to activate the user "${item.first_name} ${item.last_name}"?`}
                  buttonElem={
                    <Button
                      className="text-white"
                      variant="success"
                      type='button'
                      style={{ marginLeft: '8px' }}
                    >
                      <UserCheck size={20} />
                    </Button>
                  }
                  handleDialogAction={() => handleApproveUser(item.id!)}
                />
              )}
              <DialogTrigger asChild>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type='button'
                        variant="outline"
                        className="ml-2 mr-2"
                        onClick={() => handleEditUser(item)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Edit</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </DialogTrigger>
              <AppConfirmationDialog
                title='Delete User'
                description={`Are you sure you want to delete the user "${item.first_name} ${item.last_name}"? This action cannot be undone.`}
                buttonElem={
                  <Button
                    className="text-white"
                    variant="destructive"
                    type='button'
                    style={{ marginLeft: '8px' }}
                  >
                    <Trash size={20} />
                  </Button>
                }
                handleDialogAction={() => handleDeleteUser(item.id!)}
              />
            </Dialog>
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    }

  ];

  const pagination = React.useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );

  const table = useReactTable({
    data: data?.data ?? Array(10).fill({}),
    columns: isLoading
      ? columns.map((column) => ({
        ...column,
        cell: () => <Skeleton className='h-12 w-full' />,
      }))
      : columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    onGlobalFilterChange: setSearchKeyword,
    pageCount: data?.last_page ?? -1,
    manualPagination: true,
    manualFiltering: true,
    manualSorting: true,
    state: {
      sorting,
      rowSelection,
      pagination,
      globalFilter: searchKeyword,
    },
  });

  return (
    <div>
      <AppTable table={table} />
      {selectedUser && (
        <AppUserForm
          data={selectedUser}
          isOpen={isEditUserDialogOpen}
          onClose={() => setIsEditUserDialogOpen(false)}
          queryClient={queryClient}
        />
      )}

    </div>
  );
}
