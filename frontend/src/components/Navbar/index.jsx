import "./index.css";
import { Link,useNavigate } from "react-router-dom";

import { logout } from "../../features/authSlice";
import { useDispatch, useSelector } from "react-redux";

export default function Navbar() {
    //potentially fix so that a are links from react!
    const user = useSelector((state) => state.auth.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    return(
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <a className="navbar-brand m-3" href="/">Red Cottage in Bodega Bay</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation"><span className="navbar-toggler-icon"></span></button>
        <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
                <li className="nav-item my-3">
                <Link className="nav-link" to="/learnmore">Learn More</Link>
            </li>
            <li className="nav-item my-3">
                <Link className="nav-link" to="/booknow">Book Now</Link>
            </li>

            {
                user && user.token ? (
                  <li className="nav-item my-1">
                    <div className="dropdown">
                      <button
                        className="btn btn-lg dropdown-toggle p-3"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <i className="bi bi-person-circle"></i>
                      </button>
                      <ul className="dropdown-menu">
                        <li>
                          <Link
                            className=" dropdown-item"
                            aria-current="page"
                            to={"/profile"}
                          >
                            Profile
                          </Link>
                        </li>
                        <li>
                          <button
                            style={{ cursor: "pointer" }}
                            className="dropdown-item"
                            onClick={() => {
                              localStorage.removeItem("user");
                              dispatch(logout);
                              navigate("/home");
                              window.location.reload();
                            }}
                          >
                            Logout
                          </button>
                        </li>
                      </ul>
                    </div>
                  </li>
                ) : 
                <div className="p-2 my-1">
                <Link className="nav-link active" aria-current="page" to="/login">
                  <p className="m-1">Login</p>
                </Link>    
              </div>}
            </ul>
      </div>
    </nav>
    )
}