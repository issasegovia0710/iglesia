import React, { useEffect, useState, useRef } from "react";

/* ====== CONTENIDO POR DEFECTO (SI NO HAY BACK O FALLA) ====== */

const defaultContent = {
  hero: {
    titlePrefix: "Comunidad de",
    titleHighlight: "San José",
    chip: "Misas · Sacramentos · Comunidad",
    subtitle:
      "Un espacio para la oración diaria, la Eucaristía y las celebraciones más importantes de tu vida: bautizos, bodas, XV años y misas especiales.",
    imageUrl:
      "https://images.pexels.com/photos/29843273/pexels-photo-29843273.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  schedules: [
    {
      id: "weekday",
      label: "Lunes a viernes",
      hours: "07:00 · 19:00",
      note: "Templo principal",
    },
    {
      id: "saturday",
      label: "Sábado",
      hours: "07:00 · 17:00",
      note: "Misa de jóvenes",
    },
    {
      id: "sunday",
      label: "Domingo",
      hours: "07:00 · 09:00 · 12:00 · 19:00",
      note: "Aurora, niños, misa familiar y vespertina",
    },
  ],
  costs: [
    { label: "Bautizo", price: "$800 MXN" },
    { label: "Boda religiosa", price: "$3,000 MXN" },
    { label: "XV años", price: "$2,500 MXN" },
    { label: "Misa de difunto", price: "$600 MXN" },
  ],
  prayers: [
    {
      title: "Santo Rosario",
      description:
        "Rezo comunitario del rosario antes o después de misa en días señalados.",
      schedule: "Ejemplo: Lunes y jueves · 18:30 h",
    },
    {
      title: "Adoración al Santísimo",
      description:
        "Tiempo de silencio, canto y adoración frente al Santísimo Sacramento.",
      schedule: "Ejemplo: Primer viernes de mes · 19:30 h",
    },
    {
      title: "Confesiones",
      description:
        "Sacerdote disponible para confesión y acompañamiento espiritual.",
      schedule: "Ejemplo: Media hora antes de cada misa",
    },
  ],
  community: {
    sectionTitle: "Vida parroquial",
    sectionSubtitle:
      "Ejemplos de cómo podría verse tu parroquia: fachada, interior y detalles del altar. Luego sustituyes por fotos reales.",
    photos: [
      {
        title: "Fachada del templo",
        text: "Vista exterior de la iglesia, punto de encuentro de la comunidad.",
        imgUrl:
          "https://images.pexels.com/photos/3735410/pexels-photo-3735410.jpeg?auto=compress&cs=tinysrgb&w=800",
      },
      {
        title: "Interior y bancas",
        text: "Espacio de oración, luz suave, bancas y el presbiterio al fondo.",
        imgUrl:
          "https://images.pexels.com/photos/532798/pexels-photo-532798.jpeg?auto=compress&cs=tinysrgb&w=800",
      },
      {
        title: "Altar y velas",
        text: "Detalles del altar, flores y veladoras encendidas por las intenciones.",
        imgUrl:
          "https://images.pexels.com/photos/2081122/pexels-photo-2081122.jpeg?auto=compress&cs=tinysrgb&w=800",
      },
    ],
  },
  contact: {
    title: "Ubicación y oficina parroquial",
    description:
      "Reemplaza estos datos por la dirección real, teléfonos, horarios de oficina y medios de contacto.",
    address: "Calle San José s/n, Col. Centro, Tu ciudad, Tu estado.",
    phone: "(000) 000 00 00",
    officeHours: "Lunes a viernes · 10:00 a 14:00 h",
    email: "parroquia.sanjose@ejemplo.com",
  },
};

function App() {
  const [scrolled, setScrolled] = useState(false);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );
  const [content, setContent] = useState(defaultContent);
  const [loadingContent, setLoadingContent] = useState(true);

  /* ====== PALETA ====== */
  const colors = {
    accentGold: "#d4af37",
    accentGoldSoft: "#f5e7b2",
    accentGreen: "#1f4d3b",
    accentGreenSoft: "#e3f2e9",
    bgSoft: "#f9fafb",
    bgAlt: "#f5f5f4",
    textMain: "#111827",
    textMuted: "#4b5563",
    borderSubtle: "#e5e7eb",
  };

  /* ====== SCROLL Y RESIZE ====== */

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 10);
    }

    function handleResize() {
      setWindowWidth(window.innerWidth);
    }

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  /* ====== CARGAR CONTENIDO DESDE BACK ====== */

  useEffect(() => {
    async function fetchContent() {
      try {
        const res = await fetch("http://localhost:4000/api/content");
        if (!res.ok) {
          setLoadingContent(false);
          return;
        }
        const data = await res.json();

        // Mezclar lo que viene de Supabase con el default para no tronar por campos faltantes
        const merged = {
          ...defaultContent,
          ...data,
          hero: { ...defaultContent.hero, ...(data.hero || {}) },
          contact: { ...defaultContent.contact, ...(data.contact || {}) },
          schedules: data.schedules || defaultContent.schedules,
          costs: data.costs || defaultContent.costs,
          prayers: data.prayers || defaultContent.prayers,
          community: {
            ...defaultContent.community,
            ...(data.community || {}),
            photos:
              data.community && data.community.photos
                ? data.community.photos
                : defaultContent.community.photos,
          },
        };

        setContent(merged);
      } catch (err) {
        console.error("Error cargando contenido:", err);
      } finally {
        setLoadingContent(false);
      }
    }

    fetchContent();
  }, []);

  const scrollToId = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const headerOffset = 80;
    const y = el.getBoundingClientRect().top + window.scrollY - headerOffset;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  const isDesktop = windowWidth >= 768;

  /* ====== ESTILOS BASE ====== */

  const siteRootStyle = {
    minHeight: "100vh",
    fontFamily:
      'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    color: colors.textMain,
    backgroundColor: "#ffffff",
  };

  const containerStyle = {
    maxWidth: "1120px",
    margin: "0 auto",
    padding: "0 24px",
  };

  const headerStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 40,
    backgroundColor: scrolled
      ? "rgba(255,255,255,0.97)"
      : "rgba(255,255,255,0.9)",
    backdropFilter: "blur(12px)",
    borderBottom: `1px solid ${
      scrolled ? colors.borderSubtle : "transparent"
    }`,
    boxShadow: scrolled
      ? "0 10px 25px rgba(15,23,42,0.06)"
      : "0 0 0 rgba(0,0,0,0)",
    transition:
      "background-color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease",
  };

  const navGridStyle = isDesktop
    ? {
        display: "grid",
        gridTemplateColumns: "1fr auto 1fr",
        alignItems: "center",
        padding: "14px 0",
      }
    : {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "6px",
        padding: "12px 0",
      };

  const siteTitleStyle = {
    fontSize: "0.95rem",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    textAlign: isDesktop ? "left" : "center",
    color: colors.textMuted,
  };

  const siteTitleSpanStyle = {
    fontWeight: 700,
    color: colors.accentGreen,
  };

  const navMenuStyle = {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "24px",
    fontSize: "0.85rem",
  };

  const navLinkStyle = {
    background: "none",
    border: "none",
    padding: 0,
    cursor: "pointer",
    color: colors.textMain,
    letterSpacing: "0.16em",
    textTransform: "uppercase",
    fontWeight: 500,
    fontSize: "0.78rem",
    opacity: 0.9,
  };

  const navCtaStyle = {
    display: "flex",
    justifyContent: isDesktop ? "flex-end" : "center",
    marginTop: isDesktop ? 0 : "4px",
  };

  const sectionBase = {
    paddingTop: "110px",
    paddingBottom: "60px",
    backgroundColor: "#ffffff",
  };

  const heroSectionStyle = {
    ...sectionBase,
    paddingTop: "120px",
    background: `linear-gradient(180deg, ${colors.bgSoft} 0%, #ffffff 60%)`,
  };

  const centeredSectionStyle = {
    ...sectionBase,
    textAlign: "center",
  };

  const creamSectionStyle = {
    ...sectionBase,
    backgroundColor: colors.bgAlt,
  };

  const softSectionStyle = {
    ...sectionBase,
    backgroundColor: colors.bgSoft,
  };

  const heroInnerStyle = {
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1.4rem",
  };

  const heroImageWrapperStyleBase = {
    width: isDesktop ? "260px" : "220px",
    height: isDesktop ? "260px" : "220px",
    borderRadius: "999px",
    overflow: "hidden",
    boxShadow: "0 18px 40px rgba(15,23,42,0.25)",
    border: `4px solid colors.accentGoldSoft`,
    background:
      "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.7), transparent 55%)",
    transition: "transform 0.4s ease, box-shadow 0.4s ease",
    borderColor: colors.accentGoldSoft,
  };

  const heroImageStyle = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  };

  const heroTitleStyle = {
    fontFamily: 'Georgia, "Times New Roman", serif',
    fontSize: isDesktop ? "2.5rem" : "2.1rem",
    margin: 0,
    color: colors.textMain,
  };

  const heroTitleSpanStyle = {
    color: colors.accentGold,
  };

  const heroSubtitleStyle = {
    margin: 0,
    maxWidth: "34rem",
    fontSize: isDesktop ? "1rem" : "0.98rem",
    color: colors.textMuted,
  };

  const heroChipRowStyle = {
    display: "flex",
    justifyContent: "center",
    gap: "8px",
    marginTop: "4px",
    flexWrap: "wrap",
  };

  const heroChipStyle = {
    padding: "4px 10px",
    borderRadius: "999px",
    backgroundColor: colors.accentGreenSoft,
    color: colors.accentGreen,
    fontSize: "0.7rem",
    textTransform: "uppercase",
    letterSpacing: "0.12em",
    fontWeight: 600,
  };

  const heroActionsStyle = {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "0.8rem",
    marginTop: "0.8rem",
  };

  const buttonBase = {
    borderRadius: "999px",
    border: "1px solid transparent",
    fontSize: "0.9rem",
    padding: "0.65rem 1.4rem",
    cursor: "pointer",
    fontWeight: 600,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    transition:
      "background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease, transform 0.12s ease, box-shadow 0.12s ease",
  };

  const buttonPrimaryBase = {
    ...buttonBase,
    backgroundColor: colors.accentGreen,
    color: "#ffffff",
    borderColor: colors.accentGreen,
    boxShadow: "0 10px 18px rgba(31,77,59,0.35)",
  };

  const buttonSecondaryBase = {
    ...buttonBase,
    backgroundColor: "#ffffff",
    color: colors.accentGreen,
    borderColor: colors.accentGreen,
  };

  const buttonSmallBase = {
    ...buttonPrimaryBase,
    fontSize: "0.8rem",
    padding: "0.45rem 1.2rem",
    boxShadow: "0 6px 12px rgba(31,77,59,0.25)",
  };

  const sectionTitleMainStyle = {
    fontFamily: 'Georgia, "Times New Roman", serif',
    fontSize: isDesktop ? "2.6rem" : "2.3rem",
    color: colors.accentGreen,
    margin: "0 0 0.75rem",
  };

  const sectionLeadStyle = {
    maxWidth: "42rem",
    margin: "0 auto",
    fontSize: "0.98rem",
    color: colors.textMuted,
  };

  const sectionHeaderStyle = {
    textAlign: "center",
    marginBottom: "2.5rem",
  };

  const sectionTitleStyle = {
    fontFamily: 'Georgia, "Times New Roman", serif',
    fontSize: "1.8rem",
    color: colors.accentGreen,
    margin: "0 0 0.75rem",
  };

  const sectionTextStyle = {
    margin: 0,
    fontSize: "0.95rem",
    color: colors.textMuted,
    maxWidth: "36rem",
  };

  const storiesGridStyle = {
    display: "grid",
    gridTemplateColumns: isDesktop ? "repeat(3, minmax(0,1fr))" : "1fr",
    gap: "2rem",
    marginTop: "2.5rem",
  };

  const infoGridStyle = {
    display: "grid",
    gridTemplateColumns: windowWidth >= 900 ? "repeat(2, minmax(0,1fr))" : "1fr",
    gap: "2.5rem",
  };

  const infoBlockStyle = {
    backgroundColor: "#ffffff",
    borderRadius: "18px",
    padding: "1.8rem 1.6rem",
    boxShadow: "0 14px 30px rgba(15,23,42,0.06)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
  };

  const infoBlockHoverStyle = (hovered) => ({
    transform: hovered ? "translateY(-4px)" : "translateY(0)",
    boxShadow: hovered
      ? "0 18px 38px rgba(15,23,42,0.16)"
      : "0 14px 30px rgba(15,23,42,0.06)",
  });

  const scheduleListStyle = {
    listStyle: "none",
    margin: "1.3rem 0 0",
    padding: 0,
    display: "flex",
    flexDirection: "column",
    gap: "0.9rem",
  };

  const prayersGridStyle = {
    display: "grid",
    gridTemplateColumns: windowWidth >= 900 ? "repeat(3, minmax(0,1fr))" : "1fr",
    gap: "1.8rem",
    marginTop: "2.2rem",
  };

  const contactLayoutStyle = {
    display: "grid",
    gridTemplateColumns: windowWidth >= 900 ? "1.1fr 0.9fr" : "1fr",
    gap: "2rem",
    alignItems: windowWidth >= 900 ? "center" : "stretch",
  };

  const contactDetailsStyle = {
    marginTop: "1.1rem",
    fontSize: "0.92rem",
    color: colors.textMain,
  };

  const contactActionsStyle = {
    marginTop: "1.4rem",
    display: "flex",
    flexWrap: "wrap",
    gap: "0.7rem",
  };

  const mapPlaceholderStyle = {
    borderRadius: "18px",
    border: `1px dashed ${colors.borderSubtle}`,
    minHeight: "220px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: colors.textMuted,
    fontSize: "0.9rem",
    backgroundColor: "#ffffff",
  };

  /* ====== HOVERS ====== */

  const [heroHover, setHeroHover] = useState(false);
  const [hoverHorarios, setHoverHorarios] = useState(false);
  const [hoverCostos, setHoverCostos] = useState(false);

  const heroImageWrapperStyle = {
    ...heroImageWrapperStyleBase,
    transform: heroHover ? "translateY(-6px) scale(1.03)" : "translateY(0) scale(1)",
    boxShadow: heroHover
      ? "0 22px 44px rgba(15,23,42,0.38)"
      : heroImageWrapperStyleBase.boxShadow,
  };

  /* ====== RENDER ====== */

  return (
    <div style={siteRootStyle}>
      {/* HEADER */}
      <header style={headerStyle}>
        <div style={containerStyle}>
          <div style={navGridStyle}>
            <div style={siteTitleStyle}>
              Parroquia <span style={siteTitleSpanStyle}>San José</span>
            </div>

            <nav style={navMenuStyle}>
              <button
                type="button"
                style={navLinkStyle}
                onClick={() => scrollToId("acerca")}
              >
                ACERCA DE
              </button>
              <button
                type="button"
                style={navLinkStyle}
                onClick={() => scrollToId("servicios")}
              >
                HORARIOS
              </button>
              <button
                type="button"
                style={navLinkStyle}
                onClick={() => scrollToId("oracion")}
              >
                ORACIÓN
              </button>
              <button
                type="button"
                style={navLinkStyle}
                onClick={() => scrollToId("comunidad")}
              >
                COMUNIDAD
              </button>
              <button
                type="button"
                style={navLinkStyle}
                onClick={() => scrollToId("contacto")}
              >
                CONTACTO
              </button>
            </nav>

            <div style={navCtaStyle}>
              <HoverButton
                styleBase={buttonSmallBase}
                onClick={() => scrollToId("contacto")}
              >
                RESERVAR CELEBRACIÓN
              </HoverButton>
            </div>
          </div>
        </div>
      </header>

      {/* CONTENIDO */}
      <main>
        {/* HERO SAN JOSÉ */}
        <SectionReveal id="inicio" baseStyle={heroSectionStyle}>
          <div style={containerStyle}>
            <div style={heroInnerStyle}>
              <div
                style={heroImageWrapperStyle}
                onMouseEnter={() => setHeroHover(true)}
                onMouseLeave={() => setHeroHover(false)}
              >
                <img
                  style={heroImageStyle}
                  src={content.hero.imageUrl}
                  alt="Imagen de San José con el Niño Jesús"
                />
              </div>

              <h1 style={heroTitleStyle}>
                {content.hero.titlePrefix}{" "}
                <span style={heroTitleSpanStyle}>
                  {content.hero.titleHighlight}
                </span>
              </h1>

              <div style={heroChipRowStyle}>
                <div style={heroChipStyle}>{content.hero.chip}</div>
              </div>

              <p style={heroSubtitleStyle}>{content.hero.subtitle}</p>

              <div style={heroActionsStyle}>
                <HoverButton
                  styleBase={buttonSecondaryBase}
                  onClick={() => scrollToId("servicios")}
                >
                  VER HORARIOS DE MISA
                </HoverButton>
                <HoverButton
                  styleBase={buttonPrimaryBase}
                  onClick={() => scrollToId("contacto")}
                >
                  SOLICITAR INFORMACIÓN
                </HoverButton>
              </div>
            </div>
          </div>
        </SectionReveal>

        {/* TÍTULO CENTRAL */}
        <SectionReveal id="titulo-central" baseStyle={centeredSectionStyle}>
          <div style={containerStyle}>
            <h2 style={sectionTitleMainStyle}>
              San José · Misas y celebraciones
            </h2>
            <p style={sectionLeadStyle}>
              Consulta horarios de misa, devociones, costos de sacramentos,
              ubicación del templo y mira algunos detalles de la vida parroquial.
            </p>
          </div>
        </SectionReveal>

        {/* MOMENTOS DE ORACIÓN */}
        <SectionReveal id="oracion" baseStyle={softSectionStyle}>
          <div style={containerStyle}>
            <div style={sectionHeaderStyle}>
              <h3 style={sectionTitleStyle}>Momentos de oración</h3>
              <p style={{ ...sectionTextStyle, margin: "0 auto" }}>
                Espacios para rezar, agradecer y acompañar: rosario, adoración,
                confesiones y grupos parroquiales.
              </p>
            </div>

            <div style={prayersGridStyle}>
              {content.prayers.map((p, idx) => (
                <PrayerCard
                  key={idx}
                  colors={colors}
                  title={p.title}
                  description={p.description}
                  schedule={p.schedule}
                />
              ))}
            </div>
          </div>
        </SectionReveal>

        {/* VIDA PARROQUIAL (ANTES GALERÍA) */}
        <SectionReveal id="comunidad" baseStyle={creamSectionStyle}>
          <div style={containerStyle}>
            <div style={sectionHeaderStyle}>
              <h3 style={sectionTitleStyle}>
                {content.community.sectionTitle}
              </h3>
              <p style={{ ...sectionTextStyle, margin: "0 auto" }}>
                {content.community.sectionSubtitle}
              </p>
            </div>

            <div style={storiesGridStyle}>
              {content.community.photos.map((photo, idx) => (
                <StoryCard
                  key={idx}
                  colors={colors}
                  title={photo.title}
                  text={photo.text}
                  img={photo.imgUrl}
                />
              ))}
            </div>
          </div>
        </SectionReveal>

        {/* HORARIOS + COSTOS */}
        <SectionReveal id="servicios" baseStyle={sectionBase}>
          <div style={containerStyle}>
            <div style={infoGridStyle}>
              <div
                id="acerca"
                style={{
                  ...infoBlockStyle,
                  ...infoBlockHoverStyle(hoverHorarios),
                }}
                onMouseEnter={() => setHoverHorarios(true)}
                onMouseLeave={() => setHoverHorarios(false)}
              >
                <h3 style={sectionTitleStyle}>Horarios de misa</h3>
                <p style={sectionTextStyle}>
                  Sustituye estos horarios por los reales de tu parroquia.
                </p>

                <ul style={scheduleListStyle}>
                  {content.schedules.map((s) => (
                    <li key={s.id}>
                      <span
                        style={{
                          fontWeight: 600,
                          fontSize: "0.95rem",
                          display: "block",
                        }}
                      >
                        {s.label}
                      </span>
                      <span
                        style={{
                          fontSize: "0.93rem",
                          display: "block",
                        }}
                      >
                        {s.hours}
                      </span>
                      {s.note && (
                        <span
                          style={{
                            fontSize: "0.8rem",
                            color: colors.textMuted,
                            display: "block",
                          }}
                        >
                          {s.note}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              <div
                style={{
                  ...infoBlockStyle,
                  ...infoBlockHoverStyle(hoverCostos),
                }}
                onMouseEnter={() => setHoverCostos(true)}
                onMouseLeave={() => setHoverCostos(false)}
              >
                <h3 style={sectionTitleStyle}>Costos de sacramentos</h3>
                <p style={sectionTextStyle}>
                  Solo referencia visual. Luego ajustas montos, requisitos y
                  ofrendas según tu parroquia.
                </p>

                <div
                  style={{
                    marginTop: "1.3rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.6rem",
                  }}
                >
                  {content.costs.map((c, idx) => (
                    <CostRow
                      key={idx}
                      colors={colors}
                      label={c.label}
                      price={c.price}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </SectionReveal>

        {/* CONTACTO / UBICACIÓN */}
        <SectionReveal id="contacto" baseStyle={softSectionStyle}>
          <div style={containerStyle}>
            <div style={contactLayoutStyle}>
              <div style={{ maxWidth: "34rem" }}>
                <h3 style={sectionTitleStyle}>{content.contact.title}</h3>
                <p style={sectionTextStyle}>{content.contact.description}</p>

                <div style={contactDetailsStyle}>
                  <p>{content.contact.address}</p>
                  <p>Teléfono: {content.contact.phone}</p>
                  <p>Oficina: {content.contact.officeHours}</p>
                  <p>Correo: {content.contact.email}</p>
                </div>

                <div style={contactActionsStyle}>
                  <HoverButton styleBase={buttonPrimaryBase}>
                    SOLICITAR INFORMACIÓN
                  </HoverButton>
                  <HoverButton styleBase={buttonSecondaryBase}>
                    VER CÓMO LLEGAR
                  </HoverButton>
                </div>
              </div>

              <div>
                <div style={mapPlaceholderStyle}>
                  <span>Mapa de ubicación</span>
                  <small>(Reemplaza por tu iframe de Google Maps)</small>
                </div>
              </div>
            </div>
          </div>
        </SectionReveal>
      </main>

      {/* PEQUEÑO LOADER OPCIONAL */}
      {loadingContent && (
        <div
          style={{
            position: "fixed",
            bottom: "16px",
            left: "50%",
            transform: "translateX(-50%)",
            padding: "6px 12px",
            borderRadius: "999px",
            backgroundColor: "rgba(15,23,42,0.9)",
            color: "#fff",
            fontSize: "0.75rem",
          }}
        >
          Cargando contenido de la parroquia...
        </div>
      )}
    </div>
  );
}

/* ====== HOOK PARA REVELAR SECCIONES CON SCROLL ====== */

function useSectionReveal(threshold = 0.2) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
      },
      {
        threshold,
      }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [threshold]);

  return { ref, visible };
}

/* ====== WRAPPER DE SECCIÓN CON ANIMACIÓN ====== */

function SectionReveal({ id, baseStyle, children }) {
  const { ref, visible } = useSectionReveal(0.28);

  const animStyle = {
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0px)" : "translateY(28px)",
    transition: "opacity 0.6s ease, transform 0.6s ease",
  };

  return (
    <section id={id} ref={ref} style={{ ...baseStyle, ...animStyle }}>
      {children}
    </section>
  );
}

/* ====== BOTÓN CON HOVER ANIMADO ====== */

function HoverButton({ styleBase, onClick, children }) {
  const [hovered, setHovered] = useState(false);

  const style = {
    ...styleBase,
    transform: hovered ? "translateY(-2px) scale(1.02)" : "translateY(0) scale(1)",
    boxShadow: styleBase.boxShadow
      ? hovered
        ? "0 14px 26px rgba(15,23,42,0.30)"
        : styleBase.boxShadow
      : hovered
      ? "0 10px 20px rgba(15,23,42,0.18)"
      : "none",
  };

  return (
    <button
      type="button"
      style={style}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </button>
  );
}

/* ====== STORY CARD (VIDA PARROQUIAL) ====== */

function StoryCard({ title, text, img, colors }) {
  const [hovered, setHovered] = useState(false);

  const cardStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    transform: hovered ? "translateY(-4px)" : "translateY(0)",
  };

  const imageWrapperStyle = {
    width: "100%",
    maxWidth: "320px",
    aspectRatio: "4 / 5",
    overflow: "hidden",
    borderRadius: "16px",
    boxShadow: hovered
      ? "0 16px 32px rgba(15,23,42,0.28)"
      : "0 12px 26px rgba(15,23,42,0.16)",
    marginBottom: "1rem",
    border: `3px solid ${
      hovered ? colors.accentGold : "rgba(255,255,255,0.8)"
    }`,
    transition:
      "box-shadow 0.2s ease, transform 0.2s ease, border-color 0.2s ease",
  };

  const imageStyle = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  };

  const titleStyle = {
    fontFamily: 'Georgia, "Times New Roman", serif',
    fontSize: "1.4rem",
    color: colors.accentGreen,
    margin: "0 0 0.3rem",
  };

  const underlineStyle = {
    width: "40px",
    height: "3px",
    borderRadius: "999px",
    background:
      "linear-gradient(90deg, #d4af37 0%, #1f4d3b 60%, rgba(0,0,0,0) 100%)",
    marginBottom: "0.4rem",
  };

  const textStyle = {
    margin: 0,
    fontSize: "0.9rem",
    color: colors.textMain,
    maxWidth: "17rem",
  };

  return (
    <article
      style={cardStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={imageWrapperStyle}>
        <img src={img} alt={title} style={imageStyle} />
      </div>
      <h4 style={titleStyle}>{title}</h4>
      <div style={underlineStyle} />
      <p style={textStyle}>{text}</p>
    </article>
  );
}

/* ====== PRAYER CARD ====== */

function PrayerCard({ title, description, schedule, colors }) {
  const [hovered, setHovered] = useState(false);

  const cardStyle = {
    backgroundColor: "#ffffff",
    borderRadius: "18px",
    padding: "1.4rem 1.3rem",
    boxShadow: hovered
      ? "0 16px 30px rgba(15,23,42,0.16)"
      : "0 10px 22px rgba(15,23,42,0.06)",
    border: `1px solid ${
      hovered ? colors.accentGoldSoft : colors.borderSubtle
    }`,
    transition:
      "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
    transform: hovered ? "translateY(-4px)" : "translateY(0)",
  };

  const chipStyle = {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "4px 10px",
    borderRadius: "999px",
    backgroundColor: colors.accentGreenSoft,
    color: colors.accentGreen,
    fontSize: "0.7rem",
    textTransform: "uppercase",
    letterSpacing: "0.12em",
    fontWeight: 600,
    marginBottom: "0.6rem",
  };

  const titleStyle = {
    fontFamily: 'Georgia, "Times New Roman", serif',
    fontSize: "1.2rem",
    color: colors.accentGreen,
    margin: "0 0 0.4rem",
  };

  const descStyle = {
    margin: 0,
    fontSize: "0.9rem",
    color: colors.textMuted,
  };

  const scheduleStyle = {
    marginTop: "0.8rem",
    fontSize: "0.8rem",
    color: colors.accentGold,
    fontWeight: 600,
  };

  return (
    <article
      style={cardStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={chipStyle}>
        <span>✚</span>
        <span>DEVOCIÓN</span>
      </div>
      <h4 style={titleStyle}>{title}</h4>
      <p style={descStyle}>{description}</p>
      <p style={scheduleStyle}>{schedule}</p>
    </article>
  );
}

/* ====== COST ROW ====== */

function CostRow({ label, price, colors }) {
  const rowStyle = {
    display: "flex",
    alignItems: "baseline",
    justifyContent: "space-between",
    borderBottom: `1px solid ${colors.borderSubtle}`,
    paddingBottom: "0.35rem",
  };

  const labelStyle = {
    fontSize: "0.94rem",
    color: colors.textMain,
  };

  const priceStyle = {
    fontWeight: 600,
    color: colors.accentGold,
    fontSize: "0.95rem",
  };

  return (
    <div style={rowStyle}>
      <span style={labelStyle}>{label}</span>
      <span style={priceStyle}>{price}</span>
    </div>
  );
}

export default App;
