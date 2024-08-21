# react-spa-2-ssr-demo

本示例用于演示从静态网页到单页应用（SPA），再到服务器端渲染（SSR）的完整演练。我们以一个简单的用户信息展示页面为例，逐步演变这个页面的实现方式。

## 1. 静态网页示例

首先，我们创建一个最简单的静态 HTML 文件 `index.html`，用于展示用户信息，内容如下：

```html
<!DOCTYPE html>
<html lang="zh-CN">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>用户信息</title>
</head>

<body>
  <h1>用户信息</h1>
  <div>
    <p>姓名：张三</p>
    <p>年龄：18</p>
  </div>
</body>

</html>
```

- **特点**: 这是一个静态页面，所有内容在服务器上预先生成，且每次访问都是固定的。

## 2. 转换为单页应用（SPA）

接下来，我们将静态页面转换为使用 React 实现的单页应用。我们会创建一个简单的 React 应用，动态获取并展示用户信息。

### 2.1 创建 React 项目

在终端输入以下命令，创建一个 React 项目，安装依赖并启动项目：

```bash
# 创建项目
npm create vite@latest my-react-app -- --template react

# 切换目录
cd my-react-app

# 安装依赖
yarn

# 启动项目
yarn dev
```

打开浏览器，访问 <http://localhost:5173/> 可以查看默认生成的页面。

### 2.2 React 项目结构

```text
my-app/
  ├── public/
  │   └── ...
  ├── src/
  │   ├── App.jsx               # App 组件
  │   └── main.jsx              # 主文件
  ├── package.json
  └── index.html                # 模板文件
```

### 2.3 修改代码

1. 修改 `/index.html` 内容如下：

   ```html
   <!doctype html>
   <html lang="zh-CN">

   <head>
     <meta charset="UTF-8" />
     <link rel="icon" type="image/svg+xml" href="/vite.svg" />
     <meta name="viewport" content="width=device-width, initial-scale=1.0" />
     <title>用户信息</title>
   </head>

   <body>
     <div id="root"></div>
     <script type="module" src="/src/main.jsx"></script>
   </body>

   </html>
   ```

2. 修改 `src/App.jsx` 内容如下：

   ```javascript
   import { useState, useEffect } from 'react'

   function App() {
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

   export default App
   ```

3. 修改 `src/main.jsx` 内容如下：

   ```javascript
   import { StrictMode } from 'react'
   import { createRoot } from 'react-dom/client'
   import App from './App'
   
   createRoot(document.getElementById('root')).render(
     <StrictMode>
       <App />
     </StrictMode>,
   )
   ```

- **特点**：这个版本的应用在客户端通过 React 动态加载用户信息。初始页面加载时，只有 `index.html` 中的基本结构，内容由 JavaScript 动态渲染。

## 3. 转换为服务器端渲染（SSR）

在这个部分，我们将现有的 React 单页应用转换为使用 Next.js 实现的服务器端渲染（SSR）应用。通过 SSR，我们可以在服务器端生成 HTML 内容，然后将其发送到客户端，从而提升首屏加载速度和 SEO 效果。

### 3.1 安装 Next.js 和相关依赖

首先，我们需要在现有的 React 项目中安装 Next.js 和必要的依赖：

```bash
# 在项目中安装 Next.js 和相关依赖
yarn add next prop-types
```

### 3.2 项目结构调整

Next.js 依赖特定的项目结构，特别是 `pages` 目录。我们需要将现有的 React 组件和页面调整为 Next.js 的结构。

1. 创建 `pages` 目录：

   ```bash
   mkdir pages
   ```

2. 将 `src/App.jsx` 内容迁移到 `pages/index.jsx` 中：

   ```javascript
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
   ```

3. 将 `src/main.jsx` 中的代码迁移到 `pages/_app.js`，以确保在 SSR 中也能正常工作：

   ```javascript
   import PropTypes from 'prop-types'
   
   function MyApp({ Component, pageProps }) {
     return <Component {...pageProps} />
   }
   
   MyApp.propTypes = {
     Component: PropTypes.elementType.isRequired,
     pageProps: PropTypes.object
   }
   
   export default MyApp
   ```

4. 删除 `src/main.jsx` 文件，并将 `index.html` 文件移除，因为 Next.js 会自动处理 HTML 模板。

### 3.3 更新启动脚本

在 `package.json` 中，将 React 项目的启动脚本替换为 Next.js 的启动脚本：

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  }
}
```

### 3.4 启动项目

现在，你可以启动 Next.js 的开发服务器来运行 SSR 应用：

```bash
yarn dev
```

打开浏览器，访问 <http://localhost:3000/>，你将看到服务器端渲染的用户信息页面。

- **特点**：在这个版本中，用户信息在服务器端渲染，首次加载时直接将渲染后的 HTML 发送到客户端，从而提升首屏加载速度并改善 SEO 性能。

## 总结

这个文档示例涵盖了从静态 HTML 页面到 React SPA，再到 SSR 的完整演练，并详细说明了在现有 React 项目中添加 Next.js 进行服务器端渲染的步骤。
