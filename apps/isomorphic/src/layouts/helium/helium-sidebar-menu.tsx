import Link from 'next/link';
import { Fragment, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Title, Collapse, Text } from 'rizzui';
import cn from '@core/utils/class-names';
import { PiCaretDownBold, PiSignOut } from 'react-icons/pi';
import {
  menuItemsAdmin,
  menuItemsUser,
  menuItemsStockist,
  menuItemsStockistAdminPin,
} from '@/layouts/helium/helium-menu-items';
import { signOut, useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import { createPortal } from 'react-dom';

export function HeliumSidebarMenu() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [cachedRole, setCachedRole] = useState<string | null>(null);
  const [cachedUsername, setCachedUsername] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user && !isLoggingOut) {
      setCachedRole(session.user.role ?? null);
      setCachedUsername(session.user.id ?? null);
    }
  }, [session, isLoggingOut]);

  const role = isLoggingOut ? cachedRole : session?.user?.role || 'member';
  const username = isLoggingOut ? cachedUsername : session?.user?.id;

  // pick menu normally
  const menuFinal =
    role === 'admin'
      ? menuItemsAdmin
      : role === 'stockist' && username === 'adminpin2025'
        ? menuItemsStockistAdminPin
        : role === 'stockist'
          ? menuItemsStockist
          : menuItemsUser;

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut({ redirect: false });
      toast.success(<Text as="b">Anda telah keluar</Text>);
      router.push(role === 'admin' ? '/signin-admin-ipg-2025' : '/signin');
    } catch (err) {
      toast.error('Logout gagal, coba lagi');
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      {isLoggingOut &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80">
            <div className="rounded-lg bg-white p-4 text-center shadow-lg">
              <p className="font-medium text-gray-700">Logging out...</p>
            </div>
          </div>,
          document.body
        )}
      <div className="mb-20 mt-4 pb-3 3xl:mt-6">
        {menuFinal.map((item, index) => {
          const isActive = pathname === (item?.href as string);
          const pathnameExistInDropdowns: any = item?.dropdownItems?.filter(
            (dropdownItem) => dropdownItem.href === pathname
          );
          const isDropdownOpen = Boolean(pathnameExistInDropdowns?.length);

          return (
            <Fragment key={item.name + '-' + index}>
              {item?.href ? (
                <>
                  {item?.dropdownItems ? (
                    <Collapse
                      defaultOpen={isDropdownOpen}
                      header={({ open, toggle }) => (
                        <div
                          onClick={toggle}
                          className={cn(
                            'group relative mx-3 flex cursor-pointer items-center justify-between rounded-md px-3 py-2 font-medium lg:my-1 2xl:mx-5 2xl:my-2',
                            isDropdownOpen
                              ? 'before:top-2/5 text-white before:absolute before:-start-3 before:block before:h-4/5 before:w-1 before:rounded-ee-md before:rounded-se-md before:bg-white dark:text-primary dark:before:bg-primary 2xl:before:-start-5'
                              : 'text-gray-300/70 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-700'
                          )}
                        >
                          <span className="flex items-center">
                            {item?.icon && (
                              <span
                                className={cn(
                                  'me-2 inline-flex h-5 w-5 items-center justify-center rounded-md [&>svg]:h-[20px] [&>svg]:w-[20px]',
                                  isDropdownOpen
                                    ? 'text-white dark:text-primary'
                                    : 'text-gray-300/70 group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-500'
                                )}
                              >
                                {item?.icon}
                              </span>
                            )}
                            {item.name}
                          </span>

                          <PiCaretDownBold
                            strokeWidth={3}
                            className={cn(
                              'h-3.5 w-3.5 -rotate-90 text-gray-500 transition-transform duration-200 rtl:rotate-90',
                              open && 'rotate-0 rtl:rotate-0'
                            )}
                          />
                        </div>
                      )}
                    >
                      {item?.dropdownItems?.map((dropdownItem, index) => {
                        const isChildActive =
                          pathname === (dropdownItem?.href as string);

                        return (
                          <Link
                            href={dropdownItem?.href}
                            key={dropdownItem?.name + index}
                            className={cn(
                              'group mx-3.5 mb-0.5 flex items-center justify-between rounded-md px-2.5 py-2 font-medium capitalize last-of-type:mb-1 lg:last-of-type:mb-2 2xl:mx-5 2xl:px-3.5',
                              isChildActive
                                ? 'text-gray-200 dark:text-gray-700'
                                : 'text-gray-400 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-500'
                            )}
                          >
                            <div className="flex items-center truncate">
                              <span
                                className={cn(
                                  'me-[18px] ms-1 inline-flex h-1 w-1 rounded-full bg-current transition-all duration-200',
                                  isChildActive
                                    ? 'bg-primary ring-[1px] ring-primary'
                                    : 'opacity-40 group-hover:bg-gray-700'
                                )}
                              />{' '}
                              <span className="truncate">
                                {dropdownItem?.name}
                              </span>
                            </div>
                          </Link>
                        );
                      })}
                    </Collapse>
                  ) : (
                    <Link
                      href={item?.href}
                      className={cn(
                        'group relative mx-3 my-0.5 flex items-center justify-between rounded-md px-3 py-2 font-medium capitalize lg:my-1 2xl:mx-5 2xl:my-2',
                        isActive
                          ? 'before:top-2/5 text-white before:absolute before:-start-3 before:block before:h-4/5 before:w-1 before:rounded-ee-md before:rounded-se-md before:bg-white dark:text-gray-900 2xl:before:-start-5'
                          : 'text-gray-300/70 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-500 dark:hover:text-gray-700'
                      )}
                    >
                      <div className="flex items-center truncate">
                        {item?.icon && (
                          <span
                            className={cn(
                              'me-2 inline-flex h-5 w-5 items-center justify-center rounded-md transition-colors duration-200 [&>svg]:h-[20px] [&>svg]:w-[20px]',
                              isActive
                                ? 'text-white dark:text-gray-900'
                                : 'text-gray-300/70 group-hover:text-gray-500 dark:text-gray-500'
                            )}
                          >
                            {item?.icon}
                          </span>
                        )}
                        <span className="truncate">{item.name}</span>
                      </div>
                    </Link>
                  )}
                </>
              ) : (
                <Title
                  as="h6"
                  className={cn(
                    'mb-2 truncate px-6 text-xs font-normal uppercase tracking-widest text-gray-500 dark:text-gray-500 2xl:px-8',
                    index !== 0 && 'mt-6 3xl:mt-7'
                  )}
                >
                  {item.name}
                </Title>
              )}
            </Fragment>
          );
        })}
        <Title
          as="h6"
          className={cn(
            'mb-2 mt-6 truncate px-6 text-xs font-normal uppercase tracking-widest text-gray-500 dark:text-gray-500 2xl:px-8 3xl:mt-7'
          )}
        ></Title>
        <Link
          href="#"
          onClick={(e) => {
            e.preventDefault(); // prevent page reload
            handleLogout();
          }}
          className={cn(
            'group relative mx-3 my-0.5 flex items-center justify-between rounded-md px-3 py-2 font-medium capitalize text-gray-300/70 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-500 dark:hover:text-gray-700 lg:my-1 2xl:mx-5 2xl:my-2'
          )}
        >
          <div className="flex items-center truncate">
            <span
              className={cn(
                'me-2 inline-flex h-5 w-5 items-center justify-center rounded-md text-gray-300/70 transition-colors duration-200 group-hover:text-gray-500 dark:text-gray-500 [&>svg]:h-[20px] [&>svg]:w-[20px]'
              )}
            >
              <PiSignOut />
            </span>
            <span className="truncate">Keluar</span>
          </div>
        </Link>
      </div>
    </>
  );
}
