import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.jsx'
import { instance } from '../api/axios.js'

const sectionClasses = 'rounded-xl border border-line bg-surface p-6'

const labelClasses = 'block text-sm font-medium text-ink-soft'

const valueClasses = 'mt-1 rounded-md border border-line bg-paper/60 px-3 py-2 text-ink'

const inputClasses =
  'mt-1.5 w-full rounded-lg border border-line bg-paper/60 px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-faint outline-none transition focus:border-pine focus:ring-2 focus:ring-pine/25 motion-reduce:transition-none'

const primaryBtn =
  'press inline-flex items-center justify-center rounded-lg bg-pine px-5 py-2 text-sm font-semibold text-on-pine transition hover:bg-pine-strong disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine motion-reduce:transition-none'

const Alert = ({ tone, children }) => (
  <div
    className={`rounded-lg border px-4 py-2 text-sm ${
      tone === 'error'
        ? 'border-brick/30 bg-brick-soft text-brick'
        : 'border-pine/30 bg-pine-soft text-pine-strong'
    }`}
  >
    {children}
  </div>
)

export const ProfilePage = () => {
  const { user, loading, logout } = useAuth()
  const [updatingProfile, setUpdatingProfile] = useState(false)
  const [updatingPassword, setUpdatingPassword] = useState(false)
  const [deletingAccount, setDeletingAccount] = useState(false)
  const [profileMsg, setProfileMsg] = useState(null)
  const [passwordMsg, setPasswordMsg] = useState(null)
  const [profileError, setProfileError] = useState(null)
  const [passwordError, setPasswordError] = useState(null)
  const [deleteError, setDeleteError] = useState(null)

  const navigate = useNavigate()

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    reset: resetProfile,
    formState: { errors: profileErrors }
  } = useForm({
    defaultValues: {
      username: user?.username || '',
      email: user?.email || ''
    }
  })

  const {
    register: registerPass,
    handleSubmit: handlePassSubmit,
    reset: resetPass,
    formState: { errors: passErrors }
  } = useForm()

  const onUpdateProfile = handleProfileSubmit(async (data) => {
    setProfileMsg(null)
    setProfileError(null)
    setUpdatingProfile(true)
    try {
      await instance.put('/profile', {
        username: data.username,
        email: data.email
      })
      setProfileMsg('Perfil actualizado correctamente.')
      resetProfile({ username: data.username, email: data.email })
    } catch (error) {
      const dataErr = error.response?.data
      if (Array.isArray(dataErr)) {
        setProfileError(dataErr.join('. '))
      } else {
        setProfileError(dataErr?.message || 'Error al actualizar el perfil')
      }
    } finally {
      setUpdatingProfile(false)
      setTimeout(() => {
        setProfileMsg(null)
        setProfileError(null)
      }, 4000)
    }
  })

  const onChangePassword = handlePassSubmit(async (data) => {
    setPasswordMsg(null)
    setPasswordError(null)

    if (data.newPassword !== data.confirmPassword) {
      setPasswordError('Las contraseñas nuevas no coinciden')
      setTimeout(() => setPasswordError(null), 4000)
      return
    }

    setUpdatingPassword(true)
    try {
      await instance.put('/profile/password', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword
      })
      setPasswordMsg('Contraseña actualizada correctamente.')
      resetPass()
    } catch (error) {
      const dataErr = error.response?.data
      if (Array.isArray(dataErr)) {
        setPasswordError(dataErr.join('. '))
      } else {
        setPasswordError(dataErr?.message || 'Error al cambiar la contraseña')
      }
    } finally {
      setUpdatingPassword(false)
      setTimeout(() => {
        setPasswordMsg(null)
        setPasswordError(null)
      }, 4000)
    }
  })

  const onDeleteAccount = async () => {
    const confirmed = window.confirm(
      '¿Estás seguro de eliminar tu cuenta? Esta acción es irreversible y se borrarán todas tus tareas.'
    )
    if (!confirmed) return

    setDeleteError(null)
    setDeletingAccount(true)
    try {
      await instance.delete('/profile')
      await logout()
      navigate('/')
    } catch (error) {
      const data = error.response?.data
      setDeleteError(
        Array.isArray(data)
          ? data.join('. ')
          : data?.message || 'No se pudo eliminar la cuenta'
      )
      setDeletingAccount(false)
      setTimeout(() => setDeleteError(null), 5000)
    }
  }

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-160px)] items-center justify-center">
        <p className="text-sm text-ink-soft">Cargando tu perfil…</p>
      </div>
    )
  }

  return (
    <div className="stagger mx-auto flex w-full max-w-4xl flex-col gap-6 py-6 md:py-10">
      <header>
        <h1 className="text-3xl tracking-tight text-ink sm:text-4xl">
          Mi perfil
        </h1>
        <p className="mt-2 text-base text-ink-soft">
          Gestiona tu información personal y la seguridad de tu cuenta.
        </p>
      </header>

      {/* Información de cuenta */}
      <section className={sectionClasses}>
        <h2 className="text-xl text-ink">Información de la cuenta</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClasses}>Nombre de usuario</label>
            <p className={valueClasses}>{user?.username}</p>
          </div>
          <div>
            <label className={labelClasses}>Correo electrónico</label>
            <p className={valueClasses}>{user?.email}</p>
          </div>
          <div>
            <label className={labelClasses}>Miembro desde</label>
            <p className={valueClasses}>
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString('es-ES')
                : '—'}
            </p>
          </div>
          <div>
            <label className={labelClasses}>Última actualización</label>
            <p className={valueClasses}>
              {user?.updatedAt
                ? new Date(user.updatedAt).toLocaleDateString('es-ES')
                : '—'}
            </p>
          </div>
        </div>
      </section>

      {/* Actualizar perfil */}
      <section className={sectionClasses}>
        <h2 className="text-xl text-ink">Actualizar perfil</h2>
        <form onSubmit={onUpdateProfile} className="mt-4 space-y-4">
          {profileError && <Alert tone="error">{profileError}</Alert>}
          {profileMsg && <Alert tone="success">{profileMsg}</Alert>}

          <div>
            <label htmlFor="username" className={labelClasses}>
              Nombre de usuario
            </label>
            <input
              id="username"
              type="text"
              {...registerProfile('username', {
                required: 'El nombre de usuario es requerido',
                minLength: { value: 1, message: 'No puede estar vacío' }
              })}
              className={inputClasses}
            />
            {profileErrors.username && (
              <p className="mt-1.5 text-xs text-brick">
                {profileErrors.username.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="email" className={labelClasses}>
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              {...registerProfile('email', {
                required: 'El email es requerido'
              })}
              className={inputClasses}
            />
            {profileErrors.email && (
              <p className="mt-1.5 text-xs text-brick">
                {profileErrors.email.message}
              </p>
            )}
          </div>

          <div className="flex justify-end">
            <button type="submit" disabled={updatingProfile} className={primaryBtn}>
              {updatingProfile ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        </form>
      </section>

      {/* Cambiar contraseña */}
      <section className={sectionClasses}>
        <h2 className="text-xl text-ink">Cambiar contraseña</h2>
        <form onSubmit={onChangePassword} className="mt-4 space-y-4">
          {passwordError && <Alert tone="error">{passwordError}</Alert>}
          {passwordMsg && <Alert tone="success">{passwordMsg}</Alert>}

          <div>
            <label htmlFor="currentPassword" className={labelClasses}>
              Contraseña actual
            </label>
            <input
              id="currentPassword"
              type="password"
              autoComplete="current-password"
              {...registerPass('currentPassword', {
                required: 'La contraseña actual es requerida',
                minLength: { value: 6, message: 'Mínimo 6 caracteres' }
              })}
              className={inputClasses}
            />
            {passErrors.currentPassword && (
              <p className="mt-1.5 text-xs text-brick">
                {passErrors.currentPassword.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="newPassword" className={labelClasses}>
              Nueva contraseña
            </label>
            <input
              id="newPassword"
              type="password"
              autoComplete="new-password"
              {...registerPass('newPassword', {
                required: 'La nueva contraseña es requerida',
                minLength: { value: 6, message: 'Mínimo 6 caracteres' }
              })}
              className={inputClasses}
            />
            {passErrors.newPassword && (
              <p className="mt-1.5 text-xs text-brick">
                {passErrors.newPassword.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className={labelClasses}>
              Confirmar nueva contraseña
            </label>
            <input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              {...registerPass('confirmPassword', {
                required: 'Confirma la nueva contraseña',
                minLength: { value: 6, message: 'Mínimo 6 caracteres' }
              })}
              className={inputClasses}
            />
            {passErrors.confirmPassword && (
              <p className="mt-1.5 text-xs text-brick">
                {passErrors.confirmPassword.message}
              </p>
            )}
          </div>

          <div className="flex justify-end">
            <button type="submit" disabled={updatingPassword} className={primaryBtn}>
              {updatingPassword ? 'Actualizando...' : 'Cambiar contraseña'}
            </button>
          </div>
        </form>
      </section>

      {/* Zona de peligro */}
      <section className="rounded-xl border border-brick/30 bg-brick-soft/50 p-6">
        <h2 className="text-xl text-brick">Zona de peligro</h2>
        <p className="mt-2 text-sm text-ink-soft">
          Eliminar tu cuenta es irreversible. Se borrarán todas tus tareas
          asociadas.
        </p>
        {deleteError && (
          <div className="mt-4">
            <Alert tone="error">{deleteError}</Alert>
          </div>
        )}
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={onDeleteAccount}
            disabled={deletingAccount}
            className="press inline-flex items-center justify-center rounded-lg border border-brick/40 bg-surface px-5 py-2 text-sm font-semibold text-brick transition hover:bg-brick-soft disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brick motion-reduce:transition-none"
          >
            {deletingAccount ? 'Eliminando...' : 'Eliminar cuenta'}
          </button>
        </div>
      </section>
    </div>
  )
}
