export default function Login({ onLogin }: { onLogin: (u:any)=>void }) {
  return <button onClick={()=>onLogin({username:"test",role:"admin"})}>Test Login</button>;
}
