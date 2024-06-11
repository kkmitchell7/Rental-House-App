import "./index.css";

export default function Navbar() {
    //potentially fix so that a are links from react!
    return(
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <a class="navbar-brand" href="/">Red Cottage in Bodega Bay</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation"><span class="navbar-toggler-icon"></span></button>
        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav">
                <li class="nav-item">
                <a class="nav-link" href="/learnmore">Learn More</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="/booknow">Book Now</a>
            </li>
            </ul>
      </div>
    </nav>
    )
}