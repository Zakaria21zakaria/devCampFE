import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router/dom";
import { createBrowserRouter } from "react-router";
import ProductCatalogue, {
  loader as ProductCatalogueLoader,
} from "./routes/ProductCatalogue.jsx";
import RootLayout from "./routes/rootLayout.jsx";
import ProductDetails, {
  loader as ProductDetailsLoader,
} from "./routes/ProductDetails.jsx";
import Login from "./components/UserManagement/Login.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import RequireAuth from "./context/RequireAuth.jsx";
import Account from "./components/UserManagement/Account.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <ProductCatalogue />,
        loader: ProductCatalogueLoader,
      },
      {
        path: "/product/:id",
        element: <ProductDetails />,
        loader: ProductDetailsLoader,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/account",
        element: (
          <RequireAuth>
            <Account />
          </RequireAuth>
        ),
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
);
