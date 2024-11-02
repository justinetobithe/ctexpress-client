import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import Product1 from '@public/img/products/product-1.jpg';
import Product2 from '@public/img/products/product-2.jpg';
import Product3 from '@public/img/products/product-3.jpg';
import Link from 'next/link';

const ProductList = () => {
  return (
    <div className='flex flex-col space-y-5 sm:flex-row sm:space-x-5 sm:space-y-0'>
      <div className='sm:w-1/3'>
        <Card className='relative h-[330px] overflow-hidden rounded-[33px]'>
          <CardContent className='h-full p-0'>
            <div className='relative h-full w-full'>
              <Link
                href='https://www.lazada.com.ph/products/xl-3-in-1-pregnancy-prenatal-maternity-supporting-belts-belly-bands-elastic-and-breathable-support-waist-back-care-athletic-bandage-for-pregnant-women-girdle-pregnant-supporter-i473422412-s1487202125.html?c=&channelLpJumpArgs=&clickTrackInfo=query%253A%253Bnid%253A473422412%253Bsrc%253AlazadaInShopSrp%253Brn%253Ab0c574e5ff9ca273c555a18854a1e752%253Bregion%253Aph%253Bsku%253A473422412_PH%253Bprice%253A169%253Bclient%253Adesktop%253Bsupplier_id%253A1000234393%253Bbiz_source%253Ahttps%253A%252F%252Fwww.lazada.com.ph%252F%253Bslot%253A0%253Butlog_bucket_id%253A470687%253Basc_category_id%253A9749%253Bitem_id%253A473422412%253Bsku_id%253A1487202125%253Bshop_id%253A408461&fastshipping=0&freeshipping=1&fs_ab=2&fuse_fs=&lang=en&location=&price=169&priceCompare=skuId%3A1487202125%3Bsource%3Alazada-search-voucher-in-shop%3Bsn%3Ab0c574e5ff9ca273c555a18854a1e752%3BunionTrace%3A21010b7817010754401845427e6e8f%3BoriginPrice%3A16900%3BvoucherPrice%3A16900%3BdisplayPrice%3A16900%3BsourceTag%3Aauto_collect%3BsinglePromotionId%3A900000019787504%3BsingleToolCode%3ApromPrice%3BvoucherPricePlugin%3A1%3BbuyerId%3A0%3Btimestamp%3A1701075440380&ratingscore=4.936623376623377&request_id=b0c574e5ff9ca273c555a18854a1e752&review=1925&sale=6333&search=1&spm=a2o4l.store_product.list.i6.6e454887A9CIhb&stock=1'
                target='_blank'
              >
                <Image
                  src={Product1}
                  className='h-full w-full object-cover'
                  alt='PRODUCT_IMAGE'
                />
              </Link>
            </div>
          </CardContent>
        </Card>
        <p className='mt-3 text-2xl text-foreground drop-shadow-xl'>
          <Link
            href='https://www.lazada.com.ph/products/xl-3-in-1-pregnancy-prenatal-maternity-supporting-belts-belly-bands-elastic-and-breathable-support-waist-back-care-athletic-bandage-for-pregnant-women-girdle-pregnant-supporter-i473422412-s1487202125.html?c=&channelLpJumpArgs=&clickTrackInfo=query%253A%253Bnid%253A473422412%253Bsrc%253AlazadaInShopSrp%253Brn%253Ab0c574e5ff9ca273c555a18854a1e752%253Bregion%253Aph%253Bsku%253A473422412_PH%253Bprice%253A169%253Bclient%253Adesktop%253Bsupplier_id%253A1000234393%253Bbiz_source%253Ahttps%253A%252F%252Fwww.lazada.com.ph%252F%253Bslot%253A0%253Butlog_bucket_id%253A470687%253Basc_category_id%253A9749%253Bitem_id%253A473422412%253Bsku_id%253A1487202125%253Bshop_id%253A408461&fastshipping=0&freeshipping=1&fs_ab=2&fuse_fs=&lang=en&location=&price=169&priceCompare=skuId%3A1487202125%3Bsource%3Alazada-search-voucher-in-shop%3Bsn%3Ab0c574e5ff9ca273c555a18854a1e752%3BunionTrace%3A21010b7817010754401845427e6e8f%3BoriginPrice%3A16900%3BvoucherPrice%3A16900%3BdisplayPrice%3A16900%3BsourceTag%3Aauto_collect%3BsinglePromotionId%3A900000019787504%3BsingleToolCode%3ApromPrice%3BvoucherPricePlugin%3A1%3BbuyerId%3A0%3Btimestamp%3A1701075440380&ratingscore=4.936623376623377&request_id=b0c574e5ff9ca273c555a18854a1e752&review=1925&sale=6333&search=1&spm=a2o4l.store_product.list.i6.6e454887A9CIhb&stock=1'
            target='_blank'
          >
            Pregnancy Prenatal Maternity Supporting Belts
          </Link>
        </p>
      </div>
      <div className='sm:w-1/3'>
        <Card className='relative h-[330px] overflow-hidden rounded-[33px]'>
          <CardContent className='h-full p-0'>
            <div className='relative h-full w-full'>
              <Link
                href='https://www.lazada.com.ph/products/2pc-silicone-nipple-protectors-feeding-mothers-nipple-shields-protection-cover-breastfeeding-mother-milk-silicone-nipple-nursing-shield-protector-bebeta-pacifier-i470856868-s1225868061.html?c=&channelLpJumpArgs=&clickTrackInfo=query%253A%253Bnid%253A470856868%253Bsrc%253AlazadaInShopSrp%253Brn%253Ab0c574e5ff9ca273c555a18854a1e752%253Bregion%253Aph%253Bsku%253A470856868_PH%253Bprice%253A119%253Bclient%253Adesktop%253Bsupplier_id%253A1000234393%253Bbiz_source%253Ahttps%253A%252F%252Fwww.lazada.com.ph%252F%253Bslot%253A4%253Butlog_bucket_id%253A470687%253Basc_category_id%253A9750%253Bitem_id%253A470856868%253Bsku_id%253A1225868061%253Bshop_id%253A408461&fastshipping=0&freeshipping=1&fs_ab=2&fuse_fs=&lang=en&location=&price=119&priceCompare=skuId%3A1225868061%3Bsource%3Alazada-search-voucher-in-shop%3Bsn%3Ab0c574e5ff9ca273c555a18854a1e752%3BunionTrace%3A21010b7817010754401845427e6e8f%3BoriginPrice%3A11900%3BvoucherPrice%3A11900%3BdisplayPrice%3A11900%3BsourceTag%3Aauto_collect%3BsinglePromotionId%3A900000019787504%3BsingleToolCode%3ApromPrice%3BvoucherPricePlugin%3A1%3BbuyerId%3A0%3Btimestamp%3A1701075440380&ratingscore=4.607232968881413&request_id=b0c574e5ff9ca273c555a18854a1e752&review=1189&sale=5538&search=1&spm=a2o4l.store_product.list.i6.6e454887uyuT5x&stock=1'
                target='_blank'
              >
                <Image
                  src={Product2}
                  className='h-full w-full object-cover'
                  alt='PRODUCT_IMAGE'
                />
              </Link>
            </div>
          </CardContent>
        </Card>
        <p className='mt-3 text-2xl text-foreground drop-shadow-xl'>
          <Link
            href='https://www.lazada.com.ph/products/2pc-silicone-nipple-protectors-feeding-mothers-nipple-shields-protection-cover-breastfeeding-mother-milk-silicone-nipple-nursing-shield-protector-bebeta-pacifier-i470856868-s1225868061.html?c=&channelLpJumpArgs=&clickTrackInfo=query%253A%253Bnid%253A470856868%253Bsrc%253AlazadaInShopSrp%253Brn%253Ab0c574e5ff9ca273c555a18854a1e752%253Bregion%253Aph%253Bsku%253A470856868_PH%253Bprice%253A119%253Bclient%253Adesktop%253Bsupplier_id%253A1000234393%253Bbiz_source%253Ahttps%253A%252F%252Fwww.lazada.com.ph%252F%253Bslot%253A4%253Butlog_bucket_id%253A470687%253Basc_category_id%253A9750%253Bitem_id%253A470856868%253Bsku_id%253A1225868061%253Bshop_id%253A408461&fastshipping=0&freeshipping=1&fs_ab=2&fuse_fs=&lang=en&location=&price=119&priceCompare=skuId%3A1225868061%3Bsource%3Alazada-search-voucher-in-shop%3Bsn%3Ab0c574e5ff9ca273c555a18854a1e752%3BunionTrace%3A21010b7817010754401845427e6e8f%3BoriginPrice%3A11900%3BvoucherPrice%3A11900%3BdisplayPrice%3A11900%3BsourceTag%3Aauto_collect%3BsinglePromotionId%3A900000019787504%3BsingleToolCode%3ApromPrice%3BvoucherPricePlugin%3A1%3BbuyerId%3A0%3Btimestamp%3A1701075440380&ratingscore=4.607232968881413&request_id=b0c574e5ff9ca273c555a18854a1e752&review=1189&sale=5538&search=1&spm=a2o4l.store_product.list.i6.6e454887uyuT5x&stock=1'
            target='_blank'
          >
            Silicone Nipple Protectors
          </Link>
        </p>
      </div>
      <div className='sm:w-1/3'>
        <Card className='relative h-[330px] overflow-hidden rounded-[33px]'>
          <CardContent className='h-full p-0'>
            <div className='relative h-full w-full'>
              <Link
                href='https://www.lazada.com.ph/products/maternity-pillow-dismantled-pregnancy-pillow-u-shape-pregnant-protection-pillow-pillow-core-maternity-pillow-sleeping-pillow-cover-cushion-pregnancy-pillow-body-pillows-for-adult-i4150516130-s23110640323.html?c=&channelLpJumpArgs=&clickTrackInfo=query%253Apregnancy%253Bnid%253A4150516130%253Bsrc%253ALazadaMainSrp%253Brn%253Aa335e95bdcdba1b4f29f2fcc23e5e859%253Bregion%253Aph%253Bsku%253A4150516130_PH%253Bprice%253A494.5%253Bclient%253Adesktop%253Bsupplier_id%253A500452944496%253Bbiz_source%253Ah5_internal%253Bslot%253A37%253Butlog_bucket_id%253A470687%253Basc_category_id%253A5482%253Bitem_id%253A4150516130%253Bsku_id%253A23110640323%253Bshop_id%253A4456952&fastshipping=0&freeshipping=1&fs_ab=2&fuse_fs=&lang=en&location=Bulacan&price=494.5&priceCompare=skuId%3A23110640323%3Bsource%3Alazada-search-voucher%3Bsn%3Aa335e95bdcdba1b4f29f2fcc23e5e859%3BunionTrace%3A21015e6617010756055661559e5fb3%3BoriginPrice%3A49450%3BvoucherPrice%3A49450%3BdisplayPrice%3A49450%3BsourceTag%3Aauto_collect%3BsinglePromotionId%3A900000020209201%3BsingleToolCode%3ApromPrice%3BvoucherPricePlugin%3A1%3BbuyerId%3A0%3Btimestamp%3A1701075606207&ratingscore=5.0&request_id=a335e95bdcdba1b4f29f2fcc23e5e859&review=28&sale=661&search=1&source=search&spm=a2o4l.searchlist.list.i40.1aac186b6Po5w3&stock=1'
                target='_blank'
              >
                <Image
                  src={Product3}
                  className='h-full w-full object-cover'
                  alt='PRODUCT_IMAGE'
                />
              </Link>
            </div>
          </CardContent>
        </Card>
        <p className='mt-3 text-2xl text-foreground drop-shadow-xl'>
          <Link
            href='https://www.lazada.com.ph/products/maternity-pillow-dismantled-pregnancy-pillow-u-shape-pregnant-protection-pillow-pillow-core-maternity-pillow-sleeping-pillow-cover-cushion-pregnancy-pillow-body-pillows-for-adult-i4150516130-s23110640323.html?c=&channelLpJumpArgs=&clickTrackInfo=query%253Apregnancy%253Bnid%253A4150516130%253Bsrc%253ALazadaMainSrp%253Brn%253Aa335e95bdcdba1b4f29f2fcc23e5e859%253Bregion%253Aph%253Bsku%253A4150516130_PH%253Bprice%253A494.5%253Bclient%253Adesktop%253Bsupplier_id%253A500452944496%253Bbiz_source%253Ah5_internal%253Bslot%253A37%253Butlog_bucket_id%253A470687%253Basc_category_id%253A5482%253Bitem_id%253A4150516130%253Bsku_id%253A23110640323%253Bshop_id%253A4456952&fastshipping=0&freeshipping=1&fs_ab=2&fuse_fs=&lang=en&location=Bulacan&price=494.5&priceCompare=skuId%3A23110640323%3Bsource%3Alazada-search-voucher%3Bsn%3Aa335e95bdcdba1b4f29f2fcc23e5e859%3BunionTrace%3A21015e6617010756055661559e5fb3%3BoriginPrice%3A49450%3BvoucherPrice%3A49450%3BdisplayPrice%3A49450%3BsourceTag%3Aauto_collect%3BsinglePromotionId%3A900000020209201%3BsingleToolCode%3ApromPrice%3BvoucherPricePlugin%3A1%3BbuyerId%3A0%3Btimestamp%3A1701075606207&ratingscore=5.0&request_id=a335e95bdcdba1b4f29f2fcc23e5e859&review=28&sale=661&search=1&source=search&spm=a2o4l.searchlist.list.i40.1aac186b6Po5w3&stock=1'
            target='_blank'
          >
            Maternity Pillow
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ProductList;
