import { Separator } from "@/components/ui/separator";
import { Logo } from "../logo";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const Footer = () => {
  const { t } = useTranslation();

  const footerSections = [
    {
      title: t("footer.quickLinks"),
      links: [
        {
          title: t("footer.home"),
          href: "/",
        },
        {
          title: t("footer.wishlist"),
          href: "/wishlist",
        },
        {
          title: t("footer.cart"),
          href: "/cart",
        },
        {
          title: t("footer.profile"),
          href: "/settings",
        },
      ],
    },
    {
      title: t("footer.customerSupport"),
      links: [
        {
          title: t("footer.orderTracking"),
          href: "/order",
        },
        {
          title: t("footer.returnRefunds"),
          href: "/return",
        },
        {
          title: t("footer.shippingInfo"),
          href: "/shipping",
        },
        {
          title: t("footer.contactUs"),
          href: "/contact",
        },
      ],
    },
    {
      title: t("footer.companyInfo"),
      links: [
        {
          title: t("footer.aboutUs"),
          href: "/about",
        },
        {
          title: t("footer.privacyPolicy"),
          href: "/privacy",
        },
        {
          title: t("footer.termsConditions"),
          href: "/terms",
        },
      ],
    },
  ];

  return (
    <footer className="border-t">
      <div className="max-w-(--breakpoint-xl) mx-auto">
        <div className="py-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-x-8 gap-y-10 px-6 xl:px-0">
          <div className="col-span-full xl:col-span-2">
            {/* Logo */}
            <Logo />
            <p className="mt-4 text-muted-foreground">
              {t("footer.tagline")}
            </p>
          </div>
          {footerSections.map(({ title, links }) => (
            <div key={title}>
              <h6 className="font-medium">{title}</h6>
              <ul className="mt-6 space-y-4">
                {links.map(({ title: linkTitle, href }) => (
                  <li key={linkTitle}>
                    <Link
                      to={href}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      {linkTitle}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <Separator />
        <div className="py-8 flex flex-col-reverse sm:flex-row items-center justify-between gap-x-2 gap-y-5 px-6 xl:px-0">
          {/* Copyright */}
          <span className="text-muted-foreground">
            &copy; {new Date().getFullYear()} RazorBills. {t("footer.allRightsReserved")}
          </span>
        </div>
      </div>
    </footer>
  );
};
