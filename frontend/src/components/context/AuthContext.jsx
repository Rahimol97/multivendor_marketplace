import {createContext,useContext,useState,useEffect} from 'react'
import api from '../../api'

const AuthContext = createContext();
function AuthProvider ({children}) {
    const[user,setUser]= useState(null);
const [loading, setLoading] = useState(true);
    useEffect(()=>{
fetchuser();
    },[])
const fetchuser = async()=>{
  try{
const response = await api.get("/users/checkUser");
setUser(response.data);
  }
   catch {
      setUser(null);
    }
    finally {
    setLoading(false);
  }
};

  return (
   <AuthContext.Provider value = {{user,setUser, loading}}>
    {children}
   </AuthContext.Provider>
  )
}

export default AuthProvider ;
export const useAuth = () => useContext(AuthContext);
