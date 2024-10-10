// Import
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Import layouts
import PageLayout from "@/layouts/PageLayout";
import TripLayout from "@/layouts/TripLayout";

// Import pages

// Routing
const router = createBrowserRouter([
    {
        path: "/", element: <PageLayout />,
        children: [
            { index: true, element: <p>Home</p> },
            { path: "/login" , element: <p>Login</p> },
            { path: "/register" , element:  <p>Register</p>  },
            { path: "*" , element:  <p>Register</p>  },
        ],
    },
    {
        path: "/trip", element: <TripLayout /> ,
        children: [
            {index: true, element: <p>Create Trip</p>}
        ]
    },
]);

// Export AppRoute
const AppRoute = () => {
    return (
        <div>
            <RouterProvider router={router} />
        </div>
    );
};

export default AppRoute;