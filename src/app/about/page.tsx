export default function About() {
  return (
    <section className="about-page">
      <div className="about-panel">
        <p className="about-intro">
          Batsinael Fekadu is an Ethiopian visual artist and photographer based
          in Addis Ababa. His practice moves between photography, direction,
          and choreography, finding beauty in unlikely places.
        </p>

        <dl className="about-links">
          <div>
            <dt>Email</dt>
            <dd>
              <a href="mailto:contact@batsinael.com">
                contact@batsinael.com
              </a>
            </dd>
          </div>
          <div>
            <dt>Instagram</dt>
            <dd>
              <a
                href="https://instagram.com/batsinael"
                target="_blank"
                rel="noopener noreferrer"
              >
                @batsinael
              </a>
            </dd>
          </div>
        </dl>

        <dl className="about-footer">
          <div>
            <dt>Practice</dt>
            <dd>Photography / Direction / Choreography</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
