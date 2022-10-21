import Head from 'next/head'
import Link from 'next/link';
import { useState, useContext, useEffect } from 'react'
import valid from '../utils/valid'
import { DataContext } from '../store/GlobalState'
import { postData } from '../utils/fetchData'
import { useRouter } from 'next/router'


const Register = () => {
  const initialState = { name: '', email: '', password: '', cf_password: '' }
  // tạo hook uestate chứa các giá trị register với kiểu dữ liệu initialState
  const [userData, setUserData] = useState(initialState)
  //Gán các giá trị trong useData lần lượt cho các biến cùng tên
  const { name, email, password, cf_password } = userData

  const { state, dispatch } = useContext(DataContext)
  const { auth } = state

  const handleChangeInput = e => {
    //Lấy các giá trị nhập từ input
    const { name, value } = e.target
    //xét nó vào hook useState userData
    setUserData({ ...userData, [name]: value })
    dispatch({ type: 'NOTIFY', payload: {} })

  }

  const handleSubmit = async e => {
    e.preventDefault();

    const errMsg = valid(name, email, password, cf_password)
    if (errMsg) return dispatch({ type: 'NOTIFY', payload: { error: errMsg } })

    dispatch({ type: 'NOTIFY', payload: { loading: true } })

    const res = await postData('auth/register', userData)

    if (res.err) return dispatch({ type: 'NOTIFY', payload: { error: res.err } })
    dispatch({ type: 'NOTIFY', payload: { success: res.msg } })

  }

  useEffect(() => {
    if (Object.keys(auth).length !== 0) router.push("/")
  }, [auth])


  return (
    <div>
      <Head>
        <title>Register in Page</title>
      </Head>
      <div className="auth-container">
        <div className="auth-container-title">Register</div>
        <form className="mx-auto my-4" style={{ maxWidth: '500px' }} onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="label-text" htmlFor="name">Name</label>
            <input type="text" className="form-control" id="name"
              name="name" value={name} onChange={handleChangeInput} />
          </div>

          <div className="form-group">
            <label className="label-text" htmlFor="exampleInputEmail1">Email address</label>
            <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"
              name="email" value={email} onChange={handleChangeInput} />
            <small id="emailHelp" className="form-text text-muted"> We&apos;ll never share your email with anyone else.</small>
          </div>

          <div className="form-group">
            <label className="label-text" htmlFor="exampleInputPassword1">Password</label>
            <input type="password" className="form-control" id="exampleInputPassword1"
              name="password" value={password} onChange={handleChangeInput} />
          </div>

          <div className="form-group">
            <label className="label-text" htmlFor="exampleInputPassword1">Confirm Password</label>
            <input type="password" className="form-control" id="exampleInputPassword"
              name="cf_password" value={cf_password} onChange={handleChangeInput} />
          </div>

          <button type="submit" className="btn btn-dark w-100"
            style={{ marginBottom: '6px', fontWeight: '600', letterSpacing: "2px" }}>Register</button>
          <p>Already have a account?
            <Link href="/signin">
              <a className="text-info"> Login Now!</a>
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Register;