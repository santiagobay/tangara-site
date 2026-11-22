import type { MockKind } from "@/lib/site";

/** Pure-CSS mini website concepts. Sized with container query units so they scale with the card. */
export default function Mock({ kind }: { kind: MockKind }) {
  switch (kind) {
    case "sanos":
      return (
        <div className="screen mk mk-sanos" aria-hidden="true">
          <nav>
            <b>SAN.OS</b>
            <span>Inicio</span>
            <span>Galería</span>
            <span>Mi PC</span>
            <span className="pill">La 5060 Ti</span>
          </nav>
          <div className="sys">
            <i /> SYSTEM ONLINE // BOGOTÁ, CO
          </div>
          <h4>
            HEY, SOY
            <br />
            SANTIAGO
            <br />
            <em>BAYONA</em>
            <span className="caret" />
          </h4>
          <div className="rig">
            <span className="layer l1" />
            <span className="layer l2" />
            <span className="layer l3" />
            <span className="layer l4" />
            <b className="hot h1" />
            <b className="hot h2" />
            <b className="hot h3" />
          </div>
          <div className="term">
            <span>&gt; ./historia --completa</span>
            <span>2019 · portátil · concurso</span>
            <span>2024 · torre · RTX 3050</span>
          </div>
          <div className="scan" />
        </div>
      );
    case "terra":
      return (
        <div className="screen mk mk-terra" aria-hidden="true">
          <nav>
            <b>TERRA</b>
            <span>Shop</span>
            <span>Story</span>
            <span className="pill swap">
              <span className="a">Cart · 2</span>
              <span className="b">Cart · 3</span>
            </span>
          </nav>
          <h4>
            GOOD
            <br />
            THINGS
            <br />
            GROW
          </h4>
          <div className="orbs">
            <i />
            <i />
            <i />
          </div>
          <div className="sunb" />
          <div className="toast">Added · Wildflower honey</div>
        </div>
      );
    case "casa":
      return (
        <div className="screen mk mk-casa" aria-hidden="true">
          <nav>
            <b>casa forma</b>
            <span>Listings</span>
            <span>Tour</span>
          </nav>
          <h4>
            A MORE
            <br />
            HUMAN
            <br />
            HOME
          </h4>
          <div className="house">
            <div className="roof" />
            <div className="body">
              <i />
              <i />
              <i />
            </div>
          </div>
          <div className="price">
            <small>From</small> $420k
          </div>
          <div className="chip3d">3D model ↻</div>
        </div>
      );
    case "common":
      return (
        <div className="screen mk mk-common" aria-hidden="true">
          <nav>
            <b>Commons</b>
            <span>Join</span>
            <span>Impact</span>
          </nav>
          <h4>
            MOVE
            <br />
            WITH
            <br />
            MEANING
          </h4>
          <div className="form">
            <span className="typing">
              <span className="ph">Your email</span>
              <span className="val">ana@hey.com</span>
            </span>
            <em>Get involved ↗</em>
          </div>
          <div className="ring" />
        </div>
      );
    case "mesa":
      return (
        <div className="screen mk mk-mesa" aria-hidden="true">
          <nav>
            <b>Mesa</b>
            <span>Menu</span>
            <span>Reserve</span>
          </nav>
          <h4>
            Tonight, a table <em>for two.</em>
          </h4>
          <div className="slots">
            <span>6:30</span>
            <span>7:00</span>
            <span className="on">7:30</span>
            <span>8:00</span>
            <span>8:30</span>
            <span>9:00</span>
          </div>
          <div className="book swap">
            <span className="a">Reserve ↗</span>
            <span className="b">Confirmed ✓</span>
          </div>
        </div>
      );
    case "iron":
      return (
        <div className="screen mk mk-iron" aria-hidden="true">
          <nav>
            <b>IRONLINE</b>
            <span>Projects</span>
            <span>Quote</span>
          </nav>
          <h4>
            Build.
            <br />
            <em>Visualize.</em>
          </h4>
          <div className="scene3d">
            <div className="cube">
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
            </div>
          </div>
          <div className="grid" />
        </div>
      );
    case "launch":
      return (
        <div className="screen mk mk-launch" aria-hidden="true">
          <nav>
            <b>Launchpad</b>
            <span>Product</span>
            <span className="pill">Waitlist</span>
          </nav>
          <h4>
            Something small
            <br />
            is about to be <em>big.</em>
          </h4>
          <div className="bars">
            <i />
            <i />
            <i />
            <i />
            <i />
          </div>
          <div className="wait">
            <span>you@email.com</span>
            <em>Join ↗</em>
          </div>
          <div className="toast">+1 on the waitlist</div>
        </div>
      );
  }
}
