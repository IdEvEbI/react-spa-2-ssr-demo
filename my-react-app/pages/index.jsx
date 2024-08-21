import { useState, useEffect } from 'react'

function HomePage() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    // 模拟从 API 获取数据
    const fetchUserData = async () => {
      const userData = {
        name: '张三',
        age: 30,
      }
      setUser(userData)
    }
    fetchUserData()
  }, [])

  if (!user) {
    return <div>加载数据中...</div>
  }

  return (
    <>
      <h1>用户信息</h1>
      <div>姓名：{user.name}</div>
      <div>年龄：{user.age}</div>
    </>
  )
}

export default HomePage
