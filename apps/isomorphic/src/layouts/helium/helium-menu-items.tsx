import { routes } from '@/config/routes';
import { DUMMY_ID } from '@/config/constants';
import {
  PiCurrencyCircleDollarFill,
  PiShoppingCart,
  PiHeadset,
  PiPackage,
  PiChartBar,
  PiCurrencyDollar,
  PiSquaresFour,
  PiGridFour,
  PiFeather,
  PiChartLineUp,
  PiMapPinLine,
  PiUserGear,
  PiBellSimpleRinging,
  PiUser,
  PiEnvelopeSimpleOpen,
  PiSteps,
  PiCreditCard,
  PiTable,
  PiBrowser,
  PiHourglassSimple,
  PiUserCircle,
  PiShootingStar,
  PiRocketLaunch,
  PiFolderLock,
  PiBinoculars,
  PiHammer,
  PiNoteBlank,
  PiUserPlus,
  PiShieldCheck,
  PiLockKey,
  PiChatCenteredDots,
  PiCalendarPlus,
  PiHouseLine,
  PiAirplaneTilt,
  PiPokerChip,
  PiFolder,
  PiListNumbers,
  PiCaretCircleUpDown,
  PiBriefcase,
  PiCalendarDuotone,
  PiShapes,
  PiNewspaperClippingDuotone,
  PiTableDuotone,
  PiShapesDuotone,
  PiCodesandboxLogoDuotone,
  PiSparkleDuotone,
  PiArrowsOutLineHorizontalBold,
  PiPushPinDuotone,
  PiArrowsOut,
  PiHouseLineDuotone,
  PiPackageDuotone,
  PiUsers,
  PiTreeStructure,
  PiCurrencyCircleDollarDuotone,
  PiPhoneTransfer,
  PiArrowsHorizontal,
  PiGift,
  PiLog,
  PiLock,
  PiTrophy,
  PiInvoice,
  PiPercent,
  PiBook,
  PiDownload,
  PiCertificate,
  PiNote,
  PiArrowsDownUp,
  PiTarget,
  PiWallet,
  PiArrowFatLinesDown,
} from 'react-icons/pi';
import ProjectWriteIcon from '@core/components/icons/project-write';
import CrmDashIcon from '@core/components/icons/crm-icon';
import AffiliateIcon from '@core/components/icons/affiliate';
import { useSession } from 'next-auth/react';

// Note: do not add href in the label object, it is rendering as label
export const menuItems = [
  // label start
  {
    name: 'Overview',
  },
  // label end
  {
    name: 'File Manager',
    href: '/',
    icon: <PiFolder />,
  },
  {
    name: 'Appointment',
    href: routes.appointment.dashboard,
    icon: <PiCalendarDuotone />,
  },
  {
    name: 'Executive',
    href: routes.executive.dashboard,
    icon: <PiBriefcase />,
  },
  {
    name: 'Project',
    href: routes.project.dashboard,
    icon: <ProjectWriteIcon />,
  },
  {
    name: 'CRM',
    href: routes.crm.dashboard,
    icon: <CrmDashIcon />,
  },
  {
    name: 'Affiliate',
    href: routes.affiliate.dashboard,
    icon: <AffiliateIcon />,
    badge: 'NEW',
  },
  {
    name: 'Social Media',
    href: routes.socialMedia.dashboard,
    icon: <PiSparkleDuotone />,
  },
  {
    name: 'Job Board',
    href: routes.jobBoard.dashboard,
    icon: <PiShapes />,
  },
  {
    name: 'Financial',
    href: routes.financial.dashboard,
    icon: <PiCurrencyCircleDollarFill />,
  },
  {
    name: 'Logistics',
    href: routes.logistics.dashboard,
    icon: <PiPackage />,
  },
  {
    name: 'E-Commerce',
    href: routes.eCommerce.dashboard,
    icon: <PiShoppingCart />,
  },
  {
    name: 'Analytics',
    href: routes.analytics,
    icon: <PiChartBar />,
  },
  {
    name: 'Support',
    href: routes.support.dashboard,
    icon: <PiHeadset />,
  },

  // label start
  {
    name: 'Apps Kit',
  },
  // label end
  {
    name: 'E-Commerce',
    href: '#',
    icon: <PiShoppingCart />,
    dropdownItems: [
      {
        name: 'Products',
        href: routes.eCommerce.products,
        badge: '',
      },
      {
        name: 'Product Details',
        href: routes.eCommerce.productDetails(DUMMY_ID),
      },
      {
        name: 'Create Product',
        href: routes.eCommerce.createProduct,
      },
      {
        name: 'Edit Product',
        href: routes.eCommerce.ediProduct(DUMMY_ID),
      },
      {
        name: 'Categories',
        href: routes.eCommerce.categories,
      },
      {
        name: 'Create Category',
        href: routes.eCommerce.createCategory,
      },
      {
        name: 'Edit Category',
        href: routes.eCommerce.editCategory(DUMMY_ID),
      },
      {
        name: 'Orders',
        href: routes.eCommerce.orders,
      },
      {
        name: 'Order Details',
        href: routes.eCommerce.orderDetails(DUMMY_ID),
      },
      {
        name: 'Create Order',
        href: routes.eCommerce.createOrder,
      },
      {
        name: 'Edit Order',
        href: routes.eCommerce.editOrder(DUMMY_ID),
      },
      {
        name: 'Reviews',
        href: routes.eCommerce.reviews,
      },
      {
        name: 'Shop',
        href: routes.eCommerce.shop,
      },
      {
        name: 'Cart',
        href: routes.eCommerce.cart,
      },
      {
        name: 'Checkout & Payment',
        href: routes.eCommerce.checkout,
      },
    ],
  },
  {
    name: 'Support',
    href: '#',
    icon: <PiHeadset />,
    dropdownItems: [
      {
        name: 'Inbox',
        href: routes.support.inbox,
      },
      {
        name: 'Snippets',
        href: routes.support.snippets,
      },
      {
        name: 'Templates',
        href: routes.support.templates,
      },
    ],
  },
  {
    name: 'Invoice',
    href: '#',
    icon: <PiCurrencyDollar />,
    dropdownItems: [
      {
        name: 'List',
        href: routes.invoice.home,
      },
      {
        name: 'Details',
        href: routes.invoice.details(DUMMY_ID),
      },
      {
        name: 'Create',
        href: routes.invoice.create,
      },
      {
        name: 'Edit',
        href: routes.invoice.edit(DUMMY_ID),
      },
    ],
  },
  {
    name: 'Logistics',
    href: '#',
    icon: <PiPackage />,
    dropdownItems: [
      {
        name: 'Shipment List',
        href: routes.logistics.shipmentList,
      },
      {
        name: 'Shipment Details',
        href: routes.logistics.shipmentDetails(DUMMY_ID),
      },
      {
        name: 'Create Shipment',
        href: routes.logistics.createShipment,
      },
      {
        name: 'Edit Shipment',
        href: routes.logistics.editShipment(DUMMY_ID),
      },
      {
        name: 'Customer Profile',
        href: routes.logistics.customerProfile,
      },
      {
        name: 'Tracking',
        href: routes.logistics.tracking(DUMMY_ID),
      },
    ],
  },
  {
    name: 'Job Feeds',
    href: routes.jobBoard.jobFeed,
    icon: <PiShapesDuotone />,
  },
  {
    name: 'Appointment',
    href: routes.appointment.appointmentList,
    icon: <PiCalendarDuotone />,
  },
  {
    name: 'File Manager',
    href: routes.file.manager,
    icon: <PiFolder />,
  },
  {
    name: 'Event Calendar',
    href: routes.eventCalendar,
    icon: <PiCalendarPlus />,
  },
  {
    name: 'Roles & Permissions',
    href: routes.rolesPermissions,
    icon: <PiFolderLock />,
  },
  {
    name: 'Invoice Builder',
    href: routes.invoice.builder,
    icon: <PiNewspaperClippingDuotone />,
  },
  {
    name: 'Image Viewer',
    href: routes.imageViewer,
    icon: <PiCodesandboxLogoDuotone />,
    badge: 'NEW',
  },
  // label start
  {
    name: 'Search & Filters',
  },
  {
    name: 'Real Estate',
    href: routes.searchAndFilter.realEstate,
    icon: <PiHouseLine />,
  },
  {
    name: 'Flight Booking',
    href: routes.searchAndFilter.flight,
    icon: <PiAirplaneTilt />,
  },
  {
    name: 'NFT',
    href: routes.searchAndFilter.nft,
    icon: <PiPokerChip />,
  },
  // label end
  // label start
  {
    name: 'Widgets',
  },
  // label end
  {
    name: 'Cards',
    href: routes.widgets.cards,
    icon: <PiSquaresFour />,
  },
  {
    name: 'Icons',
    href: routes.widgets.icons,
    icon: <PiFeather />,
  },
  {
    name: 'Charts',
    href: routes.widgets.charts,
    icon: <PiChartLineUp />,
  },
  // {
  //   name: 'Banners',
  //   href: routes.widgets.banners,
  //   icon: <PiImage />,
  // },
  {
    name: 'Maps',
    href: routes.widgets.maps,
    icon: <PiMapPinLine />,
  },
  // label start
  {
    name: 'Forms',
  },
  // label end
  {
    name: 'Account Settings',
    href: routes.forms.profileSettings,
    icon: <PiUserGear />,
  },
  {
    name: 'Notification Preference',
    href: routes.forms.notificationPreference,
    icon: <PiBellSimpleRinging />,
  },
  {
    name: 'Personal Information',
    href: routes.forms.personalInformation,
    icon: <PiUser />,
  },
  {
    name: 'Newsletter',
    href: routes.forms.newsletter,
    icon: <PiEnvelopeSimpleOpen />,
  },
  {
    name: 'Payment Checkout',
    href: routes.eCommerce.checkout,
    icon: <PiCreditCard />,
  },
  // label start
  {
    name: 'Tables',
  },
  // label end
  {
    name: 'Basic',
    href: routes.tables.basic,
    icon: <PiGridFour />,
  },
  {
    name: 'Collapsible',
    href: routes.tables.collapsible,
    icon: <PiCaretCircleUpDown />,
  },
  {
    name: 'Enhanced',
    href: routes.tables.enhanced,
    icon: <PiTable />,
  },
  {
    name: 'Sticky Header',
    href: routes.tables.stickyHeader,
    icon: <PiBrowser />,
  },
  {
    name: 'Pagination',
    href: routes.tables.pagination,
    icon: <PiListNumbers />,
  },
  {
    name: 'Search',
    href: routes.tables.search,
    icon: <PiHourglassSimple />,
  },
  {
    name: 'Resizable',
    href: routes.tables.resizable,
    icon: <PiArrowsOutLineHorizontalBold />,
  },
  {
    name: 'Pinning',
    href: routes.tables.pinning,
    icon: <PiPushPinDuotone />,
  },
  {
    name: 'Drag & Drop',
    href: routes.tables.dnd,
    icon: <PiArrowsOut />,
  },
  // label start
  {
    name: 'Pages',
  },
  {
    name: 'Profile',
    href: routes.profile,
    icon: <PiUserCircle />,
  },
  {
    name: 'Welcome',
    href: routes.welcome,
    icon: <PiShootingStar />,
  },
  {
    name: 'Coming soon',
    href: routes.comingSoon,
    icon: <PiRocketLaunch />,
  },
  {
    name: 'Access Denied',
    href: routes.accessDenied,
    icon: <PiFolderLock />,
  },
  {
    name: 'Not Found',
    href: routes.notFound,
    icon: <PiBinoculars />,
  },
  {
    name: 'Maintenance',
    href: routes.maintenance,
    icon: <PiHammer />,
  },
  {
    name: 'Blank',
    href: routes.blank,
    icon: <PiNoteBlank />,
  },

  // label start
  {
    name: 'Authentication',
  },
  // label end
  {
    name: 'Sign Up',
    href: '#',
    icon: <PiUserPlus />,
    dropdownItems: [
      {
        name: 'Modern Sign up',
        href: routes.auth.signUp1,
      },
      {
        name: 'Vintage Sign up',
        href: routes.auth.signUp2,
      },
      {
        name: 'Trendy Sign up',
        href: routes.auth.signUp3,
      },
      {
        name: 'Elegant Sign up',
        href: routes.auth.signUp4,
      },
      {
        name: 'Classic Sign up',
        href: routes.auth.signUp5,
      },
    ],
  },
  {
    name: 'Sign In',
    href: '#',
    icon: <PiShieldCheck />,
    dropdownItems: [
      {
        name: 'Modern Sign in',
        href: routes.auth.signIn1,
      },
      {
        name: 'Vintage Sign in',
        href: routes.auth.signIn2,
      },
      {
        name: 'Trendy Sign in',
        href: routes.auth.signIn3,
      },
      {
        name: 'Elegant Sign in',
        href: routes.auth.signIn4,
      },
      {
        name: 'Classic Sign in',
        href: routes.auth.signIn5,
      },
    ],
  },
  {
    name: 'Forgot Password',
    href: '#',
    icon: <PiLockKey />,
    dropdownItems: [
      {
        name: 'Modern Forgot password',
        href: routes.auth.forgotPassword1,
      },
      {
        name: 'Vintage Forgot password',
        href: routes.auth.forgotPassword2,
      },
      {
        name: 'Trendy Forgot password',
        href: routes.auth.forgotPassword3,
      },
      {
        name: 'Elegant Forgot password',
        href: routes.auth.forgotPassword4,
      },
      {
        name: 'Classic Forgot password',
        href: routes.auth.forgotPassword5,
      },
    ],
  },
  {
    name: 'OTP Pages',
    href: '#',
    icon: <PiChatCenteredDots />,
    dropdownItems: [
      {
        name: 'Modern OTP page',
        href: routes.auth.otp1,
      },
      {
        name: 'Vintage OTP page',
        href: routes.auth.otp2,
      },
      {
        name: 'Trendy OTP page',
        href: routes.auth.otp3,
      },
      {
        name: 'Elegant OTP page',
        href: routes.auth.otp4,
      },
      {
        name: 'Classic OTP page',
        href: routes.auth.otp5,
      },
    ],
  },
];

export const menuItemsUser = [
  // label start
  {
    name: 'Menu',
  },
  // label end
  {
    name: 'Dashboard',
    href: routes.dashboard.index,
    icon: <PiHouseLineDuotone />,
  },
  {
    name: 'Diagram Jaringan',
    href: routes.diagramJaringan.index,
    icon: <PiTreeStructure />,
    badge: '',
  },
  // {
  //   name: 'Posting RO',
  //   href: routes.postingRO.index,
  //   icon: <PiTreeStructure />,
  //   badge: '',
  // },
  {
    name: 'List Sponsor Unilevel',
    href: routes.sponsorUnilevel.index,
    icon: <PiArrowFatLinesDown />,
    badge: '',
  },
  {
    name: 'Pindah ID',
    href: routes.pindahId.index,
    icon: <PiUserGear />,
    badge: '',
  },
  {
    name: 'History Bonus',
    href: routes.bonus.history,
    icon: <ProjectWriteIcon />,
  },
  {
    name: 'Withdrawal Bonus',
    href: '#',
    icon: <PiGift />,
    dropdownItems: [
      {
        name: 'Withdrawal Bonus',
        href: routes.withdrawalBonus.index,
      },
      {
        name: 'History WD Bonus',
        href: routes.withdrawalBonus.history,
      },
    ],
  },
  {
    name: 'Withdrawal Gaji',
    href: '#',
    icon: <PiCurrencyCircleDollarDuotone />,
    dropdownItems: [
      {
        name: 'Withdrawal Gaji',
        href: routes.withdrawalGaji.index,
      },
      {
        name: 'History WD Gaji',
        href: routes.withdrawalGaji.history,
      },
    ],
  },
  {
    name: 'Lihat PIN',
    href: routes.lihatPin.index,
    icon: <PiTrophy />,
  },
  {
    name: 'Transfer PIN',
    href: routes.transferPin.index,
    icon: <PiArrowsHorizontal />,
  },
  {
    name: 'Pendaftaran Stockist',
    href: routes.stockist.daftar,
    icon: <PiUserPlus />,
    badge: '',
  },
  {
    name: 'List Stockist',
    href: routes.stockist.list,
    icon: <PiUsers />,
    badge: '',
  },
  {
    name: 'Peringkat',
    href: routes.peringkat.index,
    icon: <PiSteps />,
    badge: '',
  },
  {
    name: 'Sertifikat',
    href: routes.sertifikat.index,
    icon: <PiCertificate />,
    badge: '',
  },
  {
    name: 'Promo',
    href: '#',
    icon: <PiPercent />,
    dropdownItems: [
      {
        name: 'Semua Promo',
        href: routes.promo.index,
      },
      {
        name: 'Promo Tahunan',
        href: routes.promo.tahunan,
      },
    ],
  },
  {
    name: 'Download',
    href: routes.download.index,
    icon: <PiDownload />,
    badge: '',
  },
  {
    name: 'Profil Perusahaan',
    href: routes.profilPerusahaan.index,
    icon: <PiBook />,
    badge: '',
  },
  {
    name: 'Kontak',
    href: routes.kontak.index,
    icon: <PiHeadset />,
    badge: '',
  },

  {
    name: 'Personal',
  },
  // label end
  {
    name: 'Perubahan Data',
    href: routes.perubahanData.index,
    icon: <PiUserGear />,
  },
  {
    name: 'Ganti Password',
    href: routes.profil.ubahPassword,
    icon: <PiLock />,
  },
];

export const menuItemsStockist = [
  // label start
  {
    name: 'Menu',
  },
  // label end
  {
    name: 'Dashboard',
    href: routes.dashboard.index,
    icon: <PiHouseLineDuotone />,
  },
  {
    name: 'Pembelian Produk',
    href: '#',
    icon: <PiShoppingCart />,
    dropdownItems: [
      {
        name: 'Pembelian Produk',
        href: routes.produk.index,
      },
      {
        name: 'History Pembelian Produk',
        href: routes.produk.pesanan.index,
      },
    ],
  },
  {
    name: 'Lihat PIN',
    href: routes.lihatPin.index,
    icon: <PiTrophy />,
  },
  {
    name: 'Transfer PIN',
    href: routes.transferPin.index,
    icon: <PiArrowsHorizontal />,
  },
  {
    name: 'Promo',
    href: '#',
    icon: <PiPercent />,
    dropdownItems: [
      {
        name: 'Semua Promo',
        href: routes.promo.index,
      },
      {
        name: 'Promo Tahunan',
        href: routes.promo.tahunan,
      },
      {
        name: 'Promo Reward Stockist',
        href: routes.promo.rewardStockist,
      },
      {
        name: 'Promo Umroh 2026 Stockist',
        href: routes.promo.umroh2026Stockist,
      },
    ],
  },
  {
    name: 'Download',
    href: routes.download.index,
    icon: <PiDownload />,
    badge: '',
  },
  {
    name: 'Profil Perusahaan',
    href: routes.profilPerusahaan.index,
    icon: <PiBook />,
    badge: '',
  },
  {
    name: 'Kontak',
    href: routes.kontak.index,
    icon: <PiHeadset />,
    badge: '',
  },

  {
    name: 'Personal',
  },
  // label end
  {
    name: 'Profil Saya',
    href: routes.profil.index,
    icon: <PiUserGear />,
  },
  {
    name: 'Ganti Password',
    href: routes.profil.ubahPassword,
    icon: <PiLock />,
  },
];

export const menuItemsStockistAdminPin = [
  // label start
  {
    name: 'Menu',
  },
  // label end
  {
    name: 'Dashboard',
    href: routes.dashboard.index,
    icon: <PiHouseLineDuotone />,
  },
  {
    name: 'Pembelian Produk',
    href: '#',
    icon: <PiShoppingCart />,
    dropdownItems: [
      {
        name: 'Pembelian Produk',
        href: routes.produk.index,
      },
      {
        name: 'History Pembelian Stockist',
        href: routes.produk.pesananStockist.index,
      },
    ],
  },
  {
    name: 'Lihat PIN',
    href: routes.lihatPin.index,
    icon: <PiTrophy />,
  },
  {
    name: 'Transfer PIN',
    href: routes.transferPin.index,
    icon: <PiArrowsHorizontal />,
  },
  {
    name: 'Penarikan PIN',
    href: routes.penarikanPin.index,
    icon: <PiArrowsDownUp />,
  },

  {
    name: 'Personal',
  },
  // label end
  {
    name: 'Profil Saya',
    href: routes.profil.index,
    icon: <PiUserGear />,
  },
  {
    name: 'Ganti Password',
    href: routes.profil.ubahPassword,
    icon: <PiLock />,
  },
];

export const menuItemsAdminStock = [
  // label start
  {
    name: 'Menu',
  },
  // label end
  {
    name: 'Dashboard',
    href: routes.dashboard.index,
    icon: <PiHouseLineDuotone />,
  },
  {
    name: 'Manajemen Produk',
    href: '#',
    icon: <PiShoppingCart />,
    dropdownItems: [
      {
        name: 'Daftar Produk',
        href: routes.produk.manajemen.index,
      },
    ],
  },
  {
    name: 'Manajemen Stok',
    href: '#',
    icon: <PiPackage />,
    dropdownItems: [
      {
        name: 'Daftar Stok',
        href: routes.stok.manajemen.index,
      },
    ],
  },
  {
    name: 'History Pembelian Stockist',
    href: routes.produk.pesananStockist.index,
    icon: <PiInvoice />,
  },

  {
    name: 'Personal',
  },
  // label end
  {
    name: 'Profil Saya',
    href: routes.profil.index,
    icon: <PiUserGear />,
  },
  {
    name: 'Ganti Password',
    href: routes.profil.ubahPassword,
    icon: <PiLock />,
  },
];

export const menuItemsAdminMember = [
  // label start
  {
    name: 'Menu',
  },
  // label end
  {
    name: 'Dashboard',
    href: routes.dashboard.index,
    icon: <PiHouseLineDuotone />,
  },
  {
    name: 'Manajemen Member',
    href: '#',
    icon: <PiUsers />,
    dropdownItems: [
      {
        name: 'Daftar Member',
        href: routes.member.manajemen.index,
      },
      {
        name: 'History Edit Member',
        href: '#',
      },
    ],
  },

  {
    name: 'Personal',
  },
  // label end
  {
    name: 'Profil Saya',
    href: routes.profil.index,
    icon: <PiUserGear />,
  },
  {
    name: 'Ganti Password',
    href: routes.profil.ubahPassword,
    icon: <PiLock />,
  },
];

export const menuItemsAdmin = [
  // label start
  {
    name: 'Dashboard',
  },
  // label end
  {
    name: 'Dashboard',
    href: routes.dashboard.index,
    icon: <PiHouseLineDuotone />,
  },

  // label start
  {
    name: 'Laporan',
  },
  // label end
  {
    name: 'Sisa Saldo',
    href: routes.laporan.balance,
    icon: <PiWallet />,
  },
  {
    name: 'Generate PIN',
    href: routes.laporan.generatePin,
    icon: <ProjectWriteIcon />,
  },
  {
    name: 'Posting PIN',
    href: routes.laporan.postingPin,
    icon: <ProjectWriteIcon />,
  },
  {
    name: 'Total PIN',
    href: routes.laporan.totalPin,
    icon: <ProjectWriteIcon />,
  },
  {
    name: 'ID Asumsi Sniper',
    href: routes.laporan.sniper,
    icon: <PiTarget />,
  },
  {
    name: 'Pembayaran',
    href: '#',
    icon: <PiInvoice />,
    dropdownItems: [
      {
        name: 'Keseluruhan',
        href: routes.laporan.pembayaran,
      },
      {
        name: 'Bonus',
        href: routes.laporan.pembayaranBonus,
      },
      {
        name: 'Gaji',
        href: routes.laporan.pembayaranGaji,
      },
    ],
  },
  {
    name: 'Pembagian',
    href: '#',
    icon: <PiInvoice />,
    dropdownItems: [
      {
        name: 'Bonus Gaji',
        href: routes.laporan.pembagianGaji,
      },
      {
        name: 'Bonus Sponsor',
        href: routes.laporan.pembagianSponsor,
      },
      {
        name: 'Bonus Pasangan',
        href: routes.laporan.pembagianPasangan,
      },
    ],
  },
  {
    name: 'Manajemen Member',
    href: '#',
    icon: <PiUsers />,
    dropdownItems: [
      {
        name: 'Daftar Member',
        href: routes.member.manajemen.index,
      },
      {
        name: 'Konfirmasi Data Member',
        href: routes.member.manajemen.konfirmasi,
      },
      {
        name: 'History Edit Member',
        href: '#',
      },
    ],
  },
  {
    name: 'Manajemen Stockist',
    href: '#',
    icon: <PiUsers />,
    dropdownItems: [
      {
        name: 'Daftar Stockist',
        href: routes.stockist.manajemen.index,
      },
      {
        name: 'History Edit Stockist',
        href: '#',
      },
    ],
  },

  {
    name: 'Personal',
  },
  // label end
  {
    name: 'Profil Saya',
    href: routes.profil.index,
    icon: <PiUserGear />,
  },
  {
    name: 'Ganti Password',
    href: routes.profil.ubahPassword,
    icon: <PiLock />,
  },
];

export const menuItemsKosongan = [
  // label start
  {
    name: 'Menu',
  },
  // label end
];
