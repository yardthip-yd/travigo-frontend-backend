// Import
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";

// Import layouts
import PageLayout from "@/layouts/PageLayout";
import TripLayout from "@/layouts/TripLayout";

// Import pages
import CreateTrip from "@/pages/trip/CreateTrip";
import Home from "@/pages/Home";
import Register from "@/pages/auth/Register";
import Login from "@/pages/auth/Login";

// Routing
const router = createBrowserRouter([
    {
        path: "/", element: <PageLayout />,
        children: [
            { index: true, element: <Home /> },
            { path: "/login", element: <Login/> },
            { path: "/register", element: <Register /> },
            { path: "/pop-destination", element: <p>Popular Destination</p> },
            { path: "*", element: <Navigate to="/" /> },
        ],
    },
    {
        path: "/trip", element: <TripLayout />,
        children: [
            { index: true, element: <CreateTrip /> }
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