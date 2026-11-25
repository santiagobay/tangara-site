import type { MockKind } from "@/lib/site";

/**
 * Miniature, pure-CSS replicas of each template's first screen, so the card shows exactly what
 * opens. Sized with container-query units (the .browser frame is the container).
 */
export default function Mock({ kind }: { kind: MockKind }) {
  switch (kind) {
    case "mesa":
      return (
        <div className="screen mt mt-mesa" aria-hidden="true">
          <div className="mt-nav">
            <b className="mt-logo">Mesa</b>
            <span>Menu</span>
            <span>The room</span>
            <span>Visit</span>
            <em className="mt-pill swap">
              <span className="a">Reserve</span>
              <span className="b">Booked ✓</span>
            </em>
          </div>
          <div className="mt-copy">
            <small>Wood-fired kitchen · Wed to Sun</small>
            <h4>
              Tonight,
              <br />a table
              <br />
              <em>for two</em>
            </h4>
            <span className="mt-btn">Book a table</span>
          </div>
          <div className="mt-candle">
            <i className="glow" />
            <i className="flame" />
            <i className="wick" />
            <i className="wax" />
            <i className="spark s1" />
            <i className="spark s2" />
            <i className="spark s3" />
          </div>
        </div>
      );
    case "casa":
      return (
        <div className="screen mt mt-casa" aria-hidden="true">
          <div className="mt-nav">
            <b className="mt-logo">casa forma</b>
            <span>Homes</span>
            <span>Plans</span>
            <span>Neighbourhood</span>
            <em className="mt-pill">Book a visit</em>
          </div>
          <div className="mt-copy">
            <small>Now pre-selling · Leslieville, Toronto</small>
            <h4>
              A more
              <br />
              <em>human home</em>
            </h4>
            <div className="mt-stats">
              <span>
                <b>12</b>townhomes
              </span>
              <span>
                <b>7</b>available
              </span>
              <span>
                <b>4</b>min to park
              </span>
            </div>
          </div>
          <div className="mt-panel">
            <div className="mt-house">
              <i className="roof" />
              <i className="body">
                <i />
                <i />
                <i className="door" />
              </i>
            </div>
            <span className="mt-chip">3D model ↻</span>
          </div>
        </div>
      );
    case "terra":
      return (
        <div className="screen mt mt-terra" aria-hidden="true">
          <div className="mt-nav">
            <b className="mt-logo">TERRA</b>
            <span>Shop</span>
            <span>Story</span>
            <em className="mt-pill swap">
              <span className="a">Cart · 0</span>
              <span className="b">Cart · 1</span>
            </em>
          </div>
          <div className="mt-copy">
            <h4>
              Good
              <br />
              things
              <br />
              grow
            </h4>
            <span className="mt-btn">Shop the pantry</span>
          </div>
          <div className="mt-jars">
            <i className="orb o1" />
            <i className="orb o2" />
            <i className="orb o3" />
            <i className="jar j1">
              <i />
            </i>
            <i className="jar j2">
              <i />
            </i>
            <i className="jar j3">
              <i />
            </i>
          </div>
          <div className="toast">Added · Wildflower honey</div>
        </div>
      );
    case "iron":
      return (
        <div className="screen mt mt-iron" aria-hidden="true">
          <div className="mt-nav">
            <b className="mt-logo">IRONLINE</b>
            <span>Services</span>
            <span>Projects</span>
            <span>Process</span>
            <em className="mt-pill">Get an estimate</em>
          </div>
          <div className="mt-copy">
            <small>Renovations &amp; additions · GTA</small>
            <h4>
              Build.
              <br />
              <em>Visualize.</em>
              <br />
              Move in.
            </h4>
            <span className="mt-btn">Estimate my project</span>
          </div>
          <div className="mt-build">
            <div className="mt-tower">
              {Array.from({ length: 5 }, (_, i) => (
                <i key={i} className="fl" style={{ "--f": i } as React.CSSProperties}>
                  <i className="f" />
                  <i className="s" />
                  <i className="t" />
                </i>
              ))}
            </div>
            <i className="mast" />
            <i className="jib" />
            <i className="cable" />
          </div>
        </div>
      );
    default:
      return <div className="screen mt" aria-hidden="true" />;
  }
}
