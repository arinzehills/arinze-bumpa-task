import { useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { Button } from '@components/Button'
import { InputField } from '@components/InputField'
import { usePost } from '@app/hooks/usePost'

interface RegisterResponse {
  user: {
    id: string
    email: string
    name: string
  }
  message: string
}

const validationSchema = yup.object({
  name: yup
    .string()
    .min(2, 'Name must be at least 2 characters')
    .required('Name is required'),
  email: yup
    .string()
    .email('Invalid email address')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
})

export const Register = () => {
  const navigate = useNavigate()
  const { isLoading, execute } = usePost<RegisterResponse>()

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      const response = await execute(
        '/auth/register',
        {
          name: values.name,
          email: values.email,
          password: values.password,
          password_confirmation: values.confirmPassword,
        },
        {
          canToastSuccess: true,
          canToastError: true,
        }
      )

      if (response) {
        // Redirect to login after successful registration
        navigate('/login')
      }
    },
  })

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-text-primary mb-2">
          Create Account
        </h1>
        <p className="text-text-secondary">
          Join us and start earning rewards
        </p>
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <InputField
          type="text"
          label="Full Name"
          name="name"
          placeholder="John Doe"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.name && formik.errors.name ? formik.errors.name : ''}
        />

        <InputField
          type="email"
          label="Email"
          name="email"
          placeholder="you@email.com"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.email && formik.errors.email ? formik.errors.email : ''
          }
        />

        <InputField
          type="password"
          label="Password"
          name="password"
          placeholder="Enter your password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          obscureText
          error={
            formik.touched.password && formik.errors.password
              ? formik.errors.password
              : ''
          }
        />

        <InputField
          type="password"
          label="Confirm Password"
          name="confirmPassword"
          placeholder="Confirm your password"
          value={formik.values.confirmPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          obscureText
          error={
            formik.touched.confirmPassword && formik.errors.confirmPassword
              ? formik.errors.confirmPassword
              : ''
          }
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          loading={isLoading}
        >
          {isLoading ? 'Creating account...' : 'Sign Up'}
        </Button>
      </form>

      <div className="text-center text-text-secondary text-sm">
        <p>
          Already have an account?{' '}
          <button
            onClick={() => navigate('/login')}
            className="text-brand-primary hover:opacity-80 font-medium"
          >
            Login here
          </button>
        </p>
      </div>
    </div>
  )
}

export default Register