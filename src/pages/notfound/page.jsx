import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function NotFoundPage() {
    const { t } = useTranslation();
    return (
        <div className='min-h-[50vh] w-full flex text-center items-center justify-center flex-col'>
            <h1 className='text-6xl font-bold text-foreground'>404</h1>
            <p className='text-md text-muted-foreground whitespace-break-spaces wrap-break-word'>{t("notfound.message")}</p>
            <Link to="/" style={{ color: 'cyan', textDecoration: 'underline' }}>
                {t("notfound.goHome")}
            </Link>
        </div>
    );
}

export default NotFoundPage;