import {createContext,useContext,useState,useEffect} from 'react'
import { useDispatch } from "react-redux";
import api from '../../api'
import { fetchCart } from "../../redux/cartSlice";

const AuthContext = createContext();
function AuthProvider ({children}) {
    const[user,setUser ]= useState(null);
    const [customerId, setCustomerId] = useState(null);
    const [customerAddress, setCustomerAddress] = useState([]);   
  const [customerMobile, setCustomerMobile] = useState(null);  

const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
useEffect(()=>{
fetchuser();
    },[])

   const fetchCustomerProfile = async (userId) => {
    try {
      const res = await api.get(`/customer/by-user/${userId}`);
      setCustomerId(res.data.customerId);

      const profile = await api.get(`/customer/getprofile/${userId}`);
      setCustomerAddress(profile.data.customer.address || []);
      setCustomerMobile(profile.data.customer.mobile || null);

    } catch (err) {
      console.log(err);
    }
  };
useEffect(() => {

    if (user?.user_id) {
      dispatch(fetchCart(user.user_id)); // load cart
       fetchCustomerProfile(user.user_id);
    }
  const fetchCustomer = async () => {
    if (!user?.user_id) return;
    try{
    const res = await api.get(`/customer/by-user/${user.user_id}`);
    setCustomerId(res.data.customerId);
      fetchCustomerProfile(user.user_id);
  } catch (err) {
        console.log(err);
      }

  };

  fetchCustomer();
}, [user]);  

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
   <AuthContext.Provider value = {{user,setUser, customerId, customerAddress,customerMobile,fetchCustomerProfile,loading}}>
    {children}
   </AuthContext.Provider>
  )
}

export default AuthProvider ;
export const useAuth = () => useContext(AuthContext);
