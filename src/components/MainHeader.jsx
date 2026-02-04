import { NavLink } from 'react-router';
import classes from './MainHeader.module.css'

export default function MainHeader() {
  return (
    <header className={classes.header}>
      <NavLink to="/"><h3>My Store</h3></NavLink>
    </header>
  );
}