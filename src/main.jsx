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
// import { AuthProvider } from "./auth/AuthContext.jsx";
// import RequireAuth from "./auth/RequireAuth.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: (
            <ProductCatalogue />
        ),
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
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* <AuthProvider> */}
      <RouterProvider router={router} />
    {/* </AuthProvider> */}
  </StrictMode>,
);
