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

  // Admin / edición
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [savingContent, setSavingContent] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

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
    border: `4px solid ${colors.accentGoldSoft}`,
    background:
      "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.7), transparent 55%)",
    transition: "transform 0.4s ease, box-shadow 0.4s ease",
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

  /* ====== HANDLERS ADMIN ====== */

  const handleAdminButtonClick = () => {
    if (!isAdmin) {
      setShowLoginModal(true);
    } else {
      setShowAdminPanel((prev) => !prev);
    }
  };

  const handleAdminLoginSuccess = () => {
    setIsAdmin(true);
    setShowLoginModal(false);
    setShowAdminPanel(true);
  };

  const handleSaveContent = async (updatedContent) => {
    setSavingContent(true);
    setSaveMessage("");
    try {
      const res = await fetch("http://localhost:4000/api/content", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedContent),
      });

      if (!res.ok) {
        throw new Error("Error al guardar en el servidor");
      }

      setContent(updatedContent);
      setSaveMessage("Contenido guardado correctamente.");
    } catch (err) {
      console.error("Error guardando contenido:", err);
      setSaveMessage("Error al guardar. Revisa el backend / consola.");
    } finally {
      setSavingContent(false);
      setTimeout(() => setSaveMessage(""), 3000);
    }
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

        {/* VIDA PARROQUIAL */}
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

      {/* BOTÓN ADMIN ABAJO (NO FIJO) */}
      <AdminBottomButton
        colors={colors}
        isAdmin={isAdmin}
        onClick={handleAdminButtonClick}
      />

      {/* MODAL LOGIN */}
      {showLoginModal && (
        <LoginModal
          colors={colors}
          onClose={() => setShowLoginModal(false)}
          onSuccess={handleAdminLoginSuccess}
        />
      )}

      {/* PANEL DE EDICIÓN ADMIN */}
      {isAdmin && showAdminPanel && (
        <AdminEditor
          colors={colors}
          content={content}
          onUpdateContent={setContent}
          onSave={handleSaveContent}
          saving={savingContent}
          saveMessage={saveMessage}
        />
      )}

      {/* LOADER */}
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
            zIndex: 60,
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
      { threshold }
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

/* ====== BOTÓN ABAJO (NO FIJO) CON IGLESIA ====== */

function AdminBottomButton({ colors, isAdmin, onClick }) {
  const [hovered, setHovered] = useState(false);

  const wrapperStyle = {
    width: "100%",
    padding: "0 24px 24px",
    boxSizing: "border-box",
    display: "flex",
    justifyContent: "flex-end",
  };

  const innerStyle = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  };

  const buttonStyle = {
    width: "36px",
    height: "36px",
    borderRadius: "999px",
    border: "1px solid rgba(15,23,42,0.15)",
    backgroundColor: hovered ? colors.accentGoldSoft : "#ffffff",
    color: colors.accentGreen,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1rem",
    cursor: "pointer",
    boxShadow: hovered
      ? "0 8px 18px rgba(0,0,0,0.25)"
      : "0 4px 10px rgba(0,0,0,0.18)",
    transform: hovered ? "translateY(-1px) scale(1.02)" : "translateY(0) scale(1)",
    transition:
      "background-color 0.2s ease, box-shadow 0.2s ease, transform 0.15s ease",
  };

  const badgeStyle = {
    fontSize: "0.7rem",
    color: colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  };

  return (
    <div style={wrapperStyle}>
      <div style={innerStyle}>
        {isAdmin && <div style={badgeStyle}>ADMIN</div>}
        <button
          type="button"
          style={buttonStyle}
          title={isAdmin ? "Editar contenido" : "Iniciar sesión"}
          onClick={onClick}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          ⛪
        </button>
      </div>
    </div>
  );
}

/* ====== MODAL LOGIN ====== */

function LoginModal({ colors, onClose, onSuccess }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const overlayStyle = {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(15,23,42,0.55)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 60,
  };

  const modalStyle = {
    width: "100%",
    maxWidth: "360px",
    backgroundColor: "#ffffff",
    borderRadius: "20px",
    padding: "1.6rem 1.5rem 1.4rem",
    boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
  };

  const titleStyle = {
    fontFamily: 'Georgia, "Times New Roman", serif',
    fontSize: "1.4rem",
    color: colors.accentGreen,
    margin: "0 0 0.4rem",
  };

  const textStyle = {
    fontSize: "0.9rem",
    color: colors.textMuted,
    margin: "0 0 1rem",
  };

  const labelStyle = {
    fontSize: "0.8rem",
    textTransform: "uppercase",
    letterSpacing: "0.12em",
    color: colors.textMuted,
    marginBottom: "0.25rem",
  };

  const inputStyle = {
    width: "100%",
    borderRadius: "999px",
    border: `1px solid ${colors.borderSubtle}`,
    padding: "0.55rem 0.9rem",
    fontSize: "0.9rem",
    marginBottom: "0.7rem",
    outline: "none",
  };

  const actionsStyle = {
    display: "flex",
    justifyContent: "flex-end",
    gap: "0.6rem",
    marginTop: "0.6rem",
  };

  const errorStyle = {
    color: "#b91c1c",
    fontSize: "0.8rem",
    marginTop: "0.25rem",
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === "sanjo2025") {
      setError("");
      onSuccess();
    } else {
      setError("Contraseña incorrecta.");
    }
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <h2 style={titleStyle}>Iniciar sesión</h2>
        <p style={textStyle}>
          Ingresa la contraseña para acceder al panel y editar horarios,
          oraciones y textos de la parroquia.
        </p>

        <form onSubmit={handleSubmit}>
          <div>
            <div style={labelStyle}>Contraseña</div>
            <input
              type="password"
              style={inputStyle}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
            {error && <div style={errorStyle}>{error}</div>}
          </div>

          <div style={actionsStyle}>
            <button
              type="button"
              onClick={onClose}
              style={{
                borderRadius: "999px",
                border: `1px solid ${colors.borderSubtle}`,
                backgroundColor: "#ffffff",
                padding: "0.45rem 1rem",
                fontSize: "0.8rem",
                cursor: "pointer",
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              style={{
                borderRadius: "999px",
                border: "1px solid transparent",
                backgroundColor: colors.accentGreen,
                color: "#ffffff",
                padding: "0.45rem 1.2rem",
                fontSize: "0.8rem",
                cursor: "pointer",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Entrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ====== PANEL ADMIN ====== */

function AdminEditor({ colors, content, onUpdateContent, onSave, saving, saveMessage }) {
  const panelStyle = {
    position: "fixed",
    right: "16px",
    top: "88px",
    bottom: "16px",
    width: "320px",
    maxWidth: "90vw",
    backgroundColor: "#ffffff",
    borderRadius: "18px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
    zIndex: 58,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  };

  const headerStyle = {
    padding: "0.9rem 1rem",
    borderBottom: `1px solid ${colors.borderSubtle}`,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  };

  const titleStyle = {
    fontSize: "0.9rem",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.12em",
    color: colors.textMuted,
  };

  const bodyStyle = {
    flex: 1,
    overflowY: "auto",
    padding: "0.8rem 1rem 1rem",
    fontSize: "0.84rem",
  };

  const sectionTitleStyle = {
    fontSize: "0.78rem",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.16em",
    color: colors.textMuted,
    marginTop: "0.5rem",
    marginBottom: "0.3rem",
  };

  const labelStyle = {
    fontSize: "0.75rem",
    textTransform: "uppercase",
    letterSpacing: "0.12em",
    color: colors.textMuted,
    marginTop: "0.35rem",
    marginBottom: "0.15rem",
  };

  const inputStyle = {
    width: "100%",
    borderRadius: "10px",
    border: `1px solid ${colors.borderSubtle}`,
    padding: "0.4rem 0.55rem",
    fontSize: "0.8rem",
    outline: "none",
  };

  const textareaStyle = {
    ...inputStyle,
    minHeight: "60px",
    resize: "vertical",
  };

  const footerStyle = {
    padding: "0.55rem 1rem 0.7rem",
    borderTop: `1px solid ${colors.borderSubtle}`,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "0.75rem",
  };

  const badgeStyle = {
    fontSize: "0.7rem",
    color: colors.textMuted,
  };

  const saveButtonStyle = {
    borderRadius: "999px",
    border: "1px solid transparent",
    backgroundColor: colors.accentGreen,
    color: "#ffffff",
    padding: "0.4rem 1rem",
    fontSize: "0.78rem",
    cursor: "pointer",
    fontWeight: 600,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  };

  const statusStyle = {
    fontSize: "0.7rem",
    color: saveMessage?.startsWith("Error") ? "#b91c1c" : colors.accentGreen,
    marginTop: "0.2rem",
  };

  const update = (path, value) => {
    const parts = path.split(".");
    const updated = { ...content };
    let ref = updated;

    for (let i = 0; i < parts.length - 1; i++) {
      const key = parts[i];
      ref[key] = Array.isArray(ref[key])
        ? [...ref[key]]
        : { ...ref[key] };
      ref = ref[key];
    }

    ref[parts[parts.length - 1]] = value;
    onUpdateContent(updated);
  };

  const updateArrayItem = (field, index, key, value) => {
    const arr = [...content[field]];
    arr[index] = { ...arr[index], [key]: value };
    onUpdateContent({
      ...content,
      [field]: arr,
    });
  };

  const updateCommunityPhoto = (index, key, value) => {
    const photos = [...content.community.photos];
    photos[index] = { ...photos[index], [key]: value };
    onUpdateContent({
      ...content,
      community: {
        ...content.community,
        photos,
      },
    });
  };

  return (
    <aside style={panelStyle}>
      <div style={headerStyle}>
        <div style={titleStyle}>Editor rápido</div>
        <div style={badgeStyle}>Guardado en Supabase</div>
      </div>

      <div style={bodyStyle}>
        {/* HERO */}
        <div>
          <div style={sectionTitleStyle}>Hero / Portada</div>
          <div style={labelStyle}>Título (inicio)</div>
          <input
            style={inputStyle}
            value={content.hero.titlePrefix}
            onChange={(e) => update("hero.titlePrefix", e.target.value)}
          />
          <div style={labelStyle}>Título (San José)</div>
          <input
            style={inputStyle}
            value={content.hero.titleHighlight}
            onChange={(e) => update("hero.titleHighlight", e.target.value)}
          />
          <div style={labelStyle}>Chip</div>
          <input
            style={inputStyle}
            value={content.hero.chip}
            onChange={(e) => update("hero.chip", e.target.value)}
          />
          <div style={labelStyle}>Subtítulo</div>
          <textarea
            style={textareaStyle}
            value={content.hero.subtitle}
            onChange={(e) => update("hero.subtitle", e.target.value)}
          />
          <div style={labelStyle}>URL imagen hero</div>
          <input
            style={inputStyle}
            value={content.hero.imageUrl}
            onChange={(e) => update("hero.imageUrl", e.target.value)}
          />
        </div>

        {/* HORARIOS */}
        <div>
          <div style={sectionTitleStyle}>Horarios de misa</div>
          {content.schedules.map((s, idx) => (
            <div key={s.id || idx} style={{ marginBottom: "0.35rem" }}>
              <div
                style={{
                  fontSize: "0.7rem",
                  color: colors.textMuted,
                  marginBottom: "0.1rem",
                }}
              >
                {s.id || `Horario ${idx + 1}`}
              </div>
              <input
                style={inputStyle}
                value={s.label}
                onChange={(e) =>
                  updateArrayItem("schedules", idx, "label", e.target.value)
                }
                placeholder="Etiqueta (Lunes a viernes...)"
              />
              <input
                style={{ ...inputStyle, marginTop: "0.2rem" }}
                value={s.hours}
                onChange={(e) =>
                  updateArrayItem("schedules", idx, "hours", e.target.value)
                }
                placeholder="Horas"
              />
              <input
                style={{ ...inputStyle, marginTop: "0.2rem" }}
                value={s.note || ""}
                onChange={(e) =>
                  updateArrayItem("schedules", idx, "note", e.target.value)
                }
                placeholder="Nota (opcional)"
              />
            </div>
          ))}
        </div>

        {/* ORACIONES */}
        <div>
          <div style={sectionTitleStyle}>Momentos de oración</div>
          {content.prayers.map((p, idx) => (
            <div key={idx} style={{ marginBottom: "0.4rem" }}>
              <div
                style={{
                  fontSize: "0.7rem",
                  color: colors.textMuted,
                  marginBottom: "0.1rem",
                }}
              >
                Oración {idx + 1}
              </div>
              <input
                style={inputStyle}
                value={p.title}
                onChange={(e) =>
                  updateArrayItem("prayers", idx, "title", e.target.value)
                }
                placeholder="Título"
              />
              <textarea
                style={{ ...textareaStyle, marginTop: "0.2rem" }}
                value={p.description}
                onChange={(e) =>
                  updateArrayItem("prayers", idx, "description", e.target.value)
                }
                placeholder="Descripción"
              />
              <input
                style={{ ...inputStyle, marginTop: "0.2rem" }}
                value={p.schedule}
                onChange={(e) =>
                  updateArrayItem("prayers", idx, "schedule", e.target.value)
                }
                placeholder="Horario"
              />
            </div>
          ))}
        </div>

        {/* VIDA PARROQUIAL */}
        <div>
          <div style={sectionTitleStyle}>Vida parroquial</div>
          <div style={labelStyle}>Título de sección</div>
          <input
            style={inputStyle}
            value={content.community.sectionTitle}
            onChange={(e) =>
              update("community.sectionTitle", e.target.value)
            }
          />
          <div style={labelStyle}>Subtítulo</div>
          <textarea
            style={textareaStyle}
            value={content.community.sectionSubtitle}
            onChange={(e) =>
              update("community.sectionSubtitle", e.target.value)
            }
          />

          {content.community.photos.map((ph, idx) => (
            <div key={idx} style={{ marginTop: "0.4rem" }}>
              <div
                style={{
                  fontSize: "0.7rem",
                  color: colors.textMuted,
                  marginBottom: "0.1rem",
                }}
              >
                Foto {idx + 1}
              </div>
              <input
                style={inputStyle}
                value={ph.title}
                onChange={(e) =>
                  updateCommunityPhoto(idx, "title", e.target.value)
                }
                placeholder="Título"
              />
              <textarea
                style={{ ...textareaStyle, marginTop: "0.2rem" }}
                value={ph.text}
                onChange={(e) =>
                  updateCommunityPhoto(idx, "text", e.target.value)
                }
                placeholder="Texto / descripción"
              />
              <input
                style={{ ...inputStyle, marginTop: "0.2rem" }}
                value={ph.imgUrl}
                onChange={(e) =>
                  updateCommunityPhoto(idx, "imgUrl", e.target.value)
                }
                placeholder="URL imagen"
              />
            </div>
          ))}
        </div>

        {/* CONTACTO */}
        <div>
          <div style={sectionTitleStyle}>Contacto</div>
          <div style={labelStyle}>Título</div>
          <input
            style={inputStyle}
            value={content.contact.title}
            onChange={(e) => update("contact.title", e.target.value)}
          />
          <div style={labelStyle}>Descripción</div>
          <textarea
            style={textareaStyle}
            value={content.contact.description}
            onChange={(e) => update("contact.description", e.target.value)}
          />
          <div style={labelStyle}>Dirección</div>
          <input
            style={inputStyle}
            value={content.contact.address}
            onChange={(e) => update("contact.address", e.target.value)}
          />
          <div style={labelStyle}>Teléfono</div>
          <input
            style={inputStyle}
            value={content.contact.phone}
            onChange={(e) => update("contact.phone", e.target.value)}
          />
          <div style={labelStyle}>Horario oficina</div>
          <input
            style={inputStyle}
            value={content.contact.officeHours}
            onChange={(e) => update("contact.officeHours", e.target.value)}
          />
          <div style={labelStyle}>Correo</div>
          <input
            style={inputStyle}
            value={content.contact.email}
            onChange={(e) => update("contact.email", e.target.value)}
          />
        </div>
      </div>

      <div style={footerStyle}>
        <div>
          <div style={badgeStyle}>
            {saving ? "Guardando..." : "Cambios en vista previa"}
          </div>
          {saveMessage && <div style={statusStyle}>{saveMessage}</div>}
        </div>
        <button
          type="button"
          onClick={() => onSave(content)}
          style={saveButtonStyle}
          disabled={saving}
        >
          Guardar
        </button>
      </div>
    </aside>
  );
}

export default App;
