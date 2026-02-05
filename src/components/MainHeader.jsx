import { Layout, Button, Typography, Space, Badge } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { NavLink, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import classes from "./MainHeader.module.css";

const { Header } = Layout;
const { Title } = Typography;

export default function MainHeader() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  // temporary value – replace with CartContext later
  const cartItemCount = 2;

  return (
    <Header className={classes.header}>
      {/* Left */}
      <NavLink to="/" className={classes.logo}>
        <Title level={4} className={classes.title}>
          My Store
        </Title>
      </NavLink>

      {/* Right */}
      <Space size="middle" className={classes.rightMenu}>
        {/* Cart */}
        <Badge count={cartItemCount} size="small">
          <Button
            type="text"
            icon={<ShoppingCartOutlined className={classes.cartIcon} />}
            onClick={() => navigate("/cart")}
          />
        </Badge>
        <Button type="link" onClick={() => navigate("/account")}>
          My Account
        </Button>
        {isAuthenticated ? (
          <>
            <Button type="primary" danger onClick={logout}>
              Logout
            </Button>
          </>
        ) : (
          <Button type="primary" onClick={() => navigate("/login")}>
            Login
          </Button>
        )}
      </Space>
    </Header>
  );
}
