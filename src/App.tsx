import Sidebar from "./Sidebar";
import Login from "./Login";

export default function App() {
  return (
    <div>
      <Sidebar />
      <Login onLogin={()=>alert('ok')} />
    </div>
  );
}
