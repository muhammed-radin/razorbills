import React from 'react';
import { Link } from 'react-router-dom';

function NotFoundPage() {
    return (
        <div className='min-h-[50vh] w-full flex text-center items-center justify-center flex-col'>
            <h1 className='text-6xl font-bold text-foreground'>404</h1>
            <p className='text-md text-muted-foreground whitespace-break-spaces wrap-break-word'>Oops! The page you are looking for does not exist.</p>
            <Link to="/" style={{ color: 'cyan', textDecoration: 'underline' }}>
                Go back to Home
            </Link>
        </div>
    );
}

export default NotFoundPage;