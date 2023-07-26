import { Link } from '../../components';
import { ErrorPage } from '../../layouts/ErrorPage';

export const NotFound = () => {
    return (
        <ErrorPage
            name="Page not found"
            message={
                <>
                    The page you are looking for does not exist. Please <Link href="/">return to the dashboard</Link>.
                </>
            }
        />
    );
};
