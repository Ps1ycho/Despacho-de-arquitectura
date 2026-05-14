<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Acceso — Arq Studio</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" />
  <link rel="stylesheet" href="css/styles.css" />
  <style>
    /* ── Extra styles for register modal ───────────────────── */
    .reg-tabs { display:flex; gap:0; margin-bottom:1.8rem; border-bottom:2px solid var(--border); }
    .reg-tab  { flex:1; padding:.7rem; text-align:center; font-family:'Jost',sans-serif;
                font-size:.72rem; letter-spacing:.12em; text-transform:uppercase;
                cursor:pointer; color:var(--stone); border-bottom:2px solid transparent;
                margin-bottom:-2px; transition:all .2s; }
    .reg-tab.active { color:var(--gold); border-bottom-color:var(--gold); font-weight:600; }
    .reg-panel { display:none; }
    .reg-panel.active { display:block; }

    .invite-code-display {
      background:var(--charcoal); color:var(--gold);
      font-family:'Courier New',monospace; font-size:1.4rem;
      letter-spacing:.3em; text-align:center; padding:1rem;
      margin:1rem 0; border-radius:2px;
    }
    .reg-info-box {
      background:rgba(201,168,76,.08); border-left:3px solid var(--gold);
      padding:.9rem 1.1rem; margin-bottom:1.2rem;
      font-size:.82rem; color:var(--stone); line-height:1.6;
    }
    .reg-info-box strong { color:var(--charcoal); }
    .step-indicator { display:flex; gap:.5rem; margin-bottom:1.5rem; }
    .step { flex:1; height:3px; background:var(--border); border-radius:2px; transition:background .3s; }
    .step.done { background:var(--gold); }
    .success-box {
      text-align:center; padding:2rem 1rem;
    }
    .success-icon {
      width:56px; height:56px; border-radius:50%;
      background:rgba(107,124,94,.15); display:flex;
      align-items:center; justify-content:center; margin:0 auto 1rem;
    }
    .pending-box {
      background:rgba(184,92,56,.06); border:1px solid rgba(184,92,56,.25);
      border-radius:2px; padding:1rem 1.2rem;
      font-size:.82rem; color:#7B3F00; line-height:1.6; margin-top:1rem;
    }
  </style>
</head>
<body>

  <div class="login-page">

    <!-- ══ VISUAL PANEL ══════════════════════════════════════ -->
    <div class="login-visual">
      <a href="index.html" class="login-visual-logo">← Arq Studio</a>
      <div>
        <p class="login-visual-quote">
          "La arquitectura es el arte de cómo<br>
          <em>habitar el mundo.</em>"
        </p>
        <p style="font-size:.75rem;color:rgba(245,240,232,.4);margin-top:1rem;letter-spacing:.1em;">
          Plataforma de Gestión Integral · v1.0
        </p>
      </div>
    </div>

    <!-- ══ FORM PANEL ════════════════════════════════════════ -->
    <div class="login-form-section">
      <div class="login-form-container">

        <p class="login-eyebrow">Plataforma interna</p>
        <h1 class="login-title">Iniciar<br>Sesión</h1>
        <p class="login-subtitle">Accede a tu panel según tu rol en el despacho.</p>

        <!-- Selector de rol -->
        <div class="mb-3">
          <p class="dash-form-label" style="margin-bottom:.8rem;">Selecciona tu rol</p>
          <div class="role-select">
            <label class="role-option active" data-role="admin">
              <input type="radio" name="role" value="admin" checked />
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M12 2a5 5 0 1 0 0 10A5 5 0 0 0 12 2z"/>
                <path d="M20 21a8 8 0 1 0-16 0"/>
                <path d="M19 8l2 2-4 4"/>
              </svg>
              <span>Admin</span>
            </label>
            <label class="role-option" data-role="arquitecto">
              <input type="radio" name="role" value="arquitecto" />
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <path d="M9 22V12h6v10"/>
              </svg>
              <span>Arquitecto</span>
            </label>
            <label class="role-option" data-role="cliente">
              <input type="radio" name="role" value="cliente" />
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              <span>Cliente</span>
            </label>
          </div>
        </div>

        <!-- Error -->
        <div id="loginError" class="login-error" style="display:none;"></div>

        <!-- Formulario de login -->
        <form id="loginForm" novalidate>
          <div class="form-group-custom">
            <label for="username" class="form-label-custom">Usuario</label>
            <input type="text" id="username" class="form-control-custom"
              placeholder="Tu nombre de usuario" autocomplete="username"/>
          </div>
          <div class="form-group-custom">
            <label for="password" class="form-label-custom">Contraseña</label>
            <input type="password" id="password" class="form-control-custom"
              placeholder="••••••••" autocomplete="current-password"/>
          </div>
          <button type="submit" id="loginBtn" class="btn-login">
            Ingresar al Sistema
          </button>
        </form>

        <!-- Botón de registro -->
        <div style="margin-top:1.2rem;text-align:center;">
          <button onclick="openRegisterModal()"
            style="background:none;border:1px solid var(--border);color:var(--stone);
                   font-family:'Jost',sans-serif;font-size:.75rem;letter-spacing:.1em;
                   text-transform:uppercase;padding:.65rem 1.4rem;cursor:pointer;
                   width:100%;transition:all .2s;"
            onmouseover="this.style.borderColor='var(--gold)';this.style.color='var(--gold)'"
            onmouseout="this.style.borderColor='var(--border)';this.style.color='var(--stone)'">
            ¿No tienes cuenta? Solicitar Acceso
          </button>
        </div>

        <div style="margin-top:1.5rem;text-align:center;">
          <a href="index.html" style="font-size:.78rem;color:var(--stone);text-decoration:underline;">
            ← Volver al sitio principal
          </a>
        </div>

      </div>
    </div>
  </div>


  <!-- ══════════════════════════════════════════════════════════
       MODAL DE REGISTRO / SOLICITUD DE ACCESO
  ═══════════════════════════════════════════════════════════ -->
  <div id="registerModal" style="
    display:none; position:fixed; inset:0; z-index:9000;
    background:rgba(28,28,26,.75); backdrop-filter:blur(6px);
    align-items:center; justify-content:center; padding:1rem;">

    <div style="
      background:#FAFAF7; width:100%; max-width:560px;
      max-height:92vh; overflow-y:auto;
      box-shadow:0 24px 80px rgba(0,0,0,.35);">

      <!-- Header del modal -->
      <div style="background:var(--charcoal);padding:1.6rem 2rem;display:flex;justify-content:space-between;align-items:center;">
        <div>
          <p style="font-size:.68rem;letter-spacing:.18em;text-transform:uppercase;color:var(--gold);margin:0 0 .3rem">Arq Studio</p>
          <h3 style="font-family:'Cormorant Garamond',serif;font-size:1.5rem;color:var(--cream);font-weight:300;margin:0">Solicitar Acceso al Sistema</h3>
        </div>
        <button onclick="closeRegisterModal()" style="background:none;border:none;color:var(--stone);cursor:pointer;font-size:1.4rem;line-height:1;">✕</button>
      </div>

      <!-- Tabs -->
      <div style="padding:1.5rem 2rem 0;">
        <div class="reg-tabs">
          <div class="reg-tab active" onclick="switchRegTab('solicitud')">
            Solicitar Acceso
          </div>
          <div class="reg-tab" onclick="switchRegTab('codigo')">
            Tengo un Código
          </div>
          <div class="reg-tab" onclick="switchRegTab('admin')">
            Admin — Generar Código
          </div>
        </div>
      </div>

      <div style="padding:0 2rem 2rem;">

        <!-- ── TAB 1: SOLICITAR ACCESO ──────────────────────── -->
        <div id="tab-solicitud" class="reg-panel active">

          <div class="reg-info-box">
            <strong>¿Cómo funciona el acceso?</strong><br>
            El acceso a la plataforma es <strong>por invitación</strong>. Completa el formulario con
            tus datos y el despacho revisará tu solicitud. Si es aprobada, recibirás un
            <strong>código de activación único</strong> por email o en persona.
          </div>

          <!-- Pasos -->
          <div style="display:flex;gap:1rem;margin-bottom:1.5rem;">
            <div style="flex:1;text-align:center;padding:.8rem;background:rgba(201,168,76,.06);border:1px solid rgba(201,168,76,.2);">
              <div style="font-family:'Cormorant Garamond',serif;font-size:1.6rem;color:var(--gold);">1</div>
              <div style="font-size:.72rem;color:var(--stone);margin-top:.3rem;">Envías tu solicitud</div>
            </div>
            <div style="flex:1;text-align:center;padding:.8rem;background:rgba(201,168,76,.06);border:1px solid rgba(201,168,76,.2);">
              <div style="font-family:'Cormorant Garamond',serif;font-size:1.6rem;color:var(--gold);">2</div>
              <div style="font-size:.72rem;color:var(--stone);margin-top:.3rem;">El despacho la revisa</div>
            </div>
            <div style="flex:1;text-align:center;padding:.8rem;background:rgba(201,168,76,.06);border:1px solid rgba(201,168,76,.2);">
              <div style="font-family:'Cormorant Garamond',serif;font-size:1.6rem;color:var(--gold);">3</div>
              <div style="font-size:.72rem;color:var(--stone);margin-top:.3rem;">Recibes tu código</div>
            </div>
            <div style="flex:1;text-align:center;padding:.8rem;background:rgba(201,168,76,.06);border:1px solid rgba(201,168,76,.2);">
              <div style="font-family:'Cormorant Garamond',serif;font-size:1.6rem;color:var(--gold);">4</div>
              <div style="font-size:.72rem;color:var(--stone);margin-top:.3rem;">Creas tu cuenta</div>
            </div>
          </div>

          <div id="solicitudSuccess" style="display:none;" class="success-box">
            <div class="success-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6B7C5E" stroke-width="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <h4 style="font-family:'Cormorant Garamond',serif;font-size:1.4rem;margin-bottom:.5rem;">Solicitud Enviada</h4>
            <p style="font-size:.85rem;color:var(--stone);">Tu solicitud ha sido registrada. El despacho la revisará y te contactará con tu código de acceso.</p>
            <div class="pending-box">
              <strong>Tiempo estimado de respuesta:</strong> 1-3 días hábiles.<br>
              Una vez aprobada, recibirás tu código de activación para crear tu cuenta.
            </div>
          </div>

          <form id="solicitudForm" novalidate>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:.8rem;">
              <div class="dash-form-group">
                <label class="dash-form-label">Nombre completo *</label>
                <input id="sol-nombre" class="dash-form-control" placeholder="Tu nombre" required/>
              </div>
              <div class="dash-form-group">
                <label class="dash-form-label">Email *</label>
                <input id="sol-email" type="email" class="dash-form-control" placeholder="correo@ejemplo.com" required/>
              </div>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:.8rem;margin-top:.8rem;">
              <div class="dash-form-group">
                <label class="dash-form-label">Teléfono</label>
                <input id="sol-tel" class="dash-form-control" placeholder="(81) 0000-0000"/>
              </div>
              <div class="dash-form-group">
                <label class="dash-form-label">Rol solicitado *</label>
                <select id="sol-rol" class="dash-form-control" required>
                  <option value="">Seleccionar...</option>
                  <option value="arquitecto">Arquitecto</option>
                  <option value="cliente">Cliente</option>
                </select>
              </div>
            </div>
            <div class="dash-form-group" style="margin-top:.8rem;">
              <label class="dash-form-label">Empresa / Proyecto (opcional)</label>
              <input id="sol-empresa" class="dash-form-control" placeholder="Nombre de tu empresa o proyecto"/>
            </div>
            <div class="dash-form-group" style="margin-top:.8rem;">
              <label class="dash-form-label">Motivo de acceso *</label>
              <textarea id="sol-motivo" class="dash-form-control" rows="3"
                placeholder="Describe brevemente por qué necesitas acceso a la plataforma..." required></textarea>
            </div>
            <div id="solicitudError" style="display:none;color:#B85C38;font-size:.8rem;margin:.6rem 0;padding:.6rem .8rem;background:rgba(184,92,56,.08);border-left:3px solid #B85C38;"></div>
            <button type="button" onclick="enviarSolicitud()"
              style="margin-top:1rem;width:100%;padding:.9rem;background:var(--charcoal);
                     color:var(--cream);border:none;font-family:'Jost',sans-serif;
                     font-size:.75rem;letter-spacing:.12em;text-transform:uppercase;cursor:pointer;">
              Enviar Solicitud de Acceso
            </button>
          </form>
        </div>

        <!-- ── TAB 2: TENGO UN CÓDIGO ────────────────────────── -->
        <div id="tab-codigo" class="reg-panel">

          <div class="reg-info-box">
            Si el despacho ya aprobó tu solicitud y te proporcionó un
            <strong>código de activación</strong>, ingrésalo aquí junto con tus datos para
            crear tu cuenta.
          </div>

          <div id="codigoSuccess" style="display:none;" class="success-box">
            <div class="success-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6B7C5E" stroke-width="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <h4 style="font-family:'Cormorant Garamond',serif;font-size:1.4rem;margin-bottom:.5rem;">¡Cuenta Creada!</h4>
            <p style="font-size:.85rem;color:var(--stone);">Tu cuenta ha sido activada. Ahora puedes iniciar sesión con tus credenciales.</p>
            <button onclick="closeRegisterModal()" style="margin-top:1rem;padding:.7rem 2rem;background:var(--gold);border:none;font-family:'Jost',sans-serif;font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;cursor:pointer;color:var(--charcoal);">Ir al Login</button>
          </div>

          <form id="codigoForm" novalidate>
            <!-- Paso 1: validar código -->
            <div id="codigoPaso1">
              <div class="dash-form-group">
                <label class="dash-form-label">Código de Activación *</label>
                <input id="cod-codigo" class="dash-form-control"
                  placeholder="Ej: ARQ-2025-XXXX" style="letter-spacing:.12em;font-family:'Courier New',monospace;font-size:1rem;" required/>
                <p style="font-size:.72rem;color:var(--stone);margin-top:.4rem;">El código te fue proporcionado por el administrador del despacho.</p>
              </div>
              <div id="codigoError1" style="display:none;color:#B85C38;font-size:.8rem;margin:.6rem 0;padding:.6rem .8rem;background:rgba(184,92,56,.08);border-left:3px solid #B85C38;"></div>
              <button type="button" onclick="validarCodigo()"
                style="margin-top:.8rem;width:100%;padding:.9rem;background:var(--charcoal);
                       color:var(--cream);border:none;font-family:'Jost',sans-serif;
                       font-size:.75rem;letter-spacing:.12em;text-transform:uppercase;cursor:pointer;">
                Validar Código
              </button>
            </div>

            <!-- Paso 2: crear cuenta (aparece tras validar) -->
            <div id="codigoPaso2" style="display:none;">
              <div style="background:rgba(107,124,94,.1);border-left:3px solid #6B7C5E;padding:.8rem 1rem;margin-bottom:1.2rem;font-size:.82rem;">
                ✓ Código válido. Completa tus datos para crear tu cuenta.
                <span id="cod-rol-info" style="font-weight:600;color:#2D5016;"></span>
              </div>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:.8rem;">
                <div class="dash-form-group">
                  <label class="dash-form-label">Nombre de usuario *</label>
                  <input id="cod-usuario" class="dash-form-control" placeholder="sin espacios" required/>
                </div>
                <div class="dash-form-group">
                  <label class="dash-form-label">Nombre completo *</label>
                  <input id="cod-nombre" class="dash-form-control" placeholder="Tu nombre" required/>
                </div>
              </div>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:.8rem;margin-top:.8rem;">
                <div class="dash-form-group">
                  <label class="dash-form-label">Contraseña *</label>
                  <input id="cod-pass" type="password" class="dash-form-control" placeholder="Mínimo 6 caracteres" required/>
                </div>
                <div class="dash-form-group">
                  <label class="dash-form-label">Confirmar contraseña *</label>
                  <input id="cod-pass2" type="password" class="dash-form-control" placeholder="Repite la contraseña" required/>
                </div>
              </div>
              <div id="codigoError2" style="display:none;color:#B85C38;font-size:.8rem;margin:.6rem 0;padding:.6rem .8rem;background:rgba(184,92,56,.08);border-left:3px solid #B85C38;"></div>
              <button type="button" onclick="crearCuenta()"
                style="margin-top:1rem;width:100%;padding:.9rem;background:var(--charcoal);
                       color:var(--cream);border:none;font-family:'Jost',sans-serif;
                       font-size:.75rem;letter-spacing:.12em;text-transform:uppercase;cursor:pointer;">
                Crear Mi Cuenta
              </button>
            </div>
          </form>
        </div>

        <!-- ── TAB 3: ADMIN — GENERAR CÓDIGO ─────────────────── -->
        <div id="tab-admin" class="reg-panel">

          <div class="reg-info-box">
            Solo el <strong>Administrador</strong> puede generar códigos de activación para nuevos usuarios.
            Ingresa tus credenciales de administrador para continuar.
          </div>

          <!-- Auth admin -->
          <div id="adminAuthPanel">
            <div class="dash-form-group">
              <label class="dash-form-label">Usuario Admin</label>
              <input id="adm-user" class="dash-form-control" placeholder="Tu usuario de admin"/>
            </div>
            <div class="dash-form-group" style="margin-top:.8rem;">
              <label class="dash-form-label">Contraseña Admin</label>
              <input id="adm-pass" type="password" class="dash-form-control" placeholder="••••••••"/>
            </div>
            <div id="admAuthError" style="display:none;color:#B85C38;font-size:.8rem;margin:.6rem 0;padding:.6rem .8rem;background:rgba(184,92,56,.08);border-left:3px solid #B85C38;"></div>
            <button type="button" onclick="autenticarAdmin()"
              style="margin-top:.8rem;width:100%;padding:.9rem;background:var(--charcoal);
                     color:var(--cream);border:none;font-family:'Jost',sans-serif;
                     font-size:.75rem;letter-spacing:.12em;text-transform:uppercase;cursor:pointer;">
              Autenticar como Admin
            </button>
          </div>

          <!-- Panel de gestión (aparece tras autenticar) -->
          <div id="adminGestionPanel" style="display:none;">

            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.2rem;">
              <p style="font-size:.72rem;letter-spacing:.12em;text-transform:uppercase;color:var(--gold);margin:0;">Panel de Administración</p>
              <button onclick="cerrarSesionAdmin()" style="background:none;border:none;font-size:.72rem;color:var(--stone);cursor:pointer;text-decoration:underline;">Cerrar sesión admin</button>
            </div>

            <!-- Generar nuevo código -->
            <div style="background:rgba(201,168,76,.06);border:1px solid rgba(201,168,76,.2);padding:1.2rem;margin-bottom:1.2rem;">
              <h5 style="font-family:'Cormorant Garamond',serif;font-size:1.1rem;margin-bottom:.8rem;">Generar Código de Invitación</h5>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:.8rem;">
                <div class="dash-form-group">
                  <label class="dash-form-label">Rol para el código</label>
                  <select id="gen-rol" class="dash-form-control">
                    <option value="arquitecto">Arquitecto</option>
                    <option value="cliente">Cliente</option>
                  </select>
                </div>
                <div class="dash-form-group">
                  <label class="dash-form-label">Para (nombre/email)</label>
                  <input id="gen-para" class="dash-form-control" placeholder="Ej: Carlos Reyes"/>
                </div>
              </div>
              <button type="button" onclick="generarCodigo()"
                style="margin-top:.8rem;padding:.7rem 1.4rem;background:var(--gold);
                       color:var(--charcoal);border:none;font-family:'Jost',sans-serif;
                       font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;cursor:pointer;font-weight:600;">
                + Generar Código
              </button>
            </div>

            <!-- Código generado -->
            <div id="codigoGeneradoPanel" style="display:none;margin-bottom:1.2rem;">
              <p style="font-size:.78rem;color:var(--stone);margin-bottom:.3rem;">Código generado para <span id="gen-para-display" style="font-weight:600;color:var(--charcoal)"></span>:</p>
              <div class="invite-code-display" id="codigoGeneradoTexto"></div>
              <p style="font-size:.72rem;color:var(--stone);text-align:center;">Rol: <span id="gen-rol-display" style="font-weight:600;color:var(--charcoal)"></span> · Válido para un solo uso · 7 días</p>
              <button onclick="copiarCodigo()" style="width:100%;margin-top:.5rem;padding:.6rem;background:rgba(201,168,76,.12);border:1px solid rgba(201,168,76,.3);font-family:'Jost',sans-serif;font-size:.7rem;letter-spacing:.1em;text-transform:uppercase;cursor:pointer;color:var(--gold);">
                Copiar Código
              </button>
            </div>

            <!-- Solicitudes pendientes -->
            <div>
              <h5 style="font-family:'Cormorant Garamond',serif;font-size:1.1rem;margin-bottom:.8rem;">Solicitudes Pendientes</h5>
              <div id="solicitudesList">
                <!-- Se llena dinámicamente -->
              </div>
            </div>

            <!-- Usuarios registrados -->
            <div style="margin-top:1.2rem;">
              <h5 style="font-family:'Cormorant Garamond',serif;font-size:1.1rem;margin-bottom:.8rem;">Usuarios Registrados</h5>
              <div id="usuariosList"></div>
            </div>

          </div>
        </div>

      </div>
    </div>
  </div>


  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
  <script src="js/login.js"></script>
</body>
</html>
