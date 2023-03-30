import ProductTable from "./ProductTable";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setAllProductStore } from "../features/productSlice";
const ShowProduct = ({}) => {
  const dispatch = useDispatch();
  const url = "http://localhost:4000/api/fetch/products";
  const productQuery = useQuery({
    queryKey: ["product"],
    queryFn: async () => {
      return axios.get(url).then((res) => {
        dispatch(setAllProductStore([...res.data]));
        return res.data;
      });
    },
  });

  return (
    <div>
      <ProductTable />
    </div>
  );
};
export default ShowProduct;
