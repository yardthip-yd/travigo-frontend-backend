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
import ViewTrip from "@/pages/trip/[tripId]/ViewTrip";
import MyTrip from "@/pages/trip/MyTrip";
import UserAccount from "@/pages/account/UserAccount";
import AdminAccount from "@/pages/account/AdminAccount";

// Import store
import useAuthStore from "@/stores/authStore";

// Routing
const guestRouter = createBrowserRouter([
    {
        path: "/", element: <PageLayout />,
        children: [
            { index: true, element: <Home /> },
            { path: "/login", element: <Login /> },
            { path: "/register", element: <Register /> },
            { path: "*", element: <Navigate to="/" /> },
        ],
    }
]);

const userRouter = createBrowserRouter([
    {
        path: "/", element: <TripLayout />,
        children: [
            { index: true, element: <CreateTrip /> },
            { path: "/view-trip/:tripId", element: <ViewTrip /> },
            { path: "/my-trip/", element: <MyTrip /> },
            { path: "/user/account", element: <UserAccount /> },
            { path: "/admin/account", element: <AdminAccount /> },
            { path: "*", element: <Navigate to="/" /> },
        ]
    },
])


// Export AppRoute
const AppRoute = () => {

    // State for use authStore
    const user = useAuthStore((state) => state.user)

    const finalRouter = user ? userRouter : guestRouter

    return (
        <div>
            <RouterProvider router={finalRouter} />
        </div>
    );
};

export default AppRoute;