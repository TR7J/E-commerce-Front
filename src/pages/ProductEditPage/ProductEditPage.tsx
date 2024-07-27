import React, {
  ChangeEvent,
  FormEvent,
  useContext /* , useEffect, */,
  useReducer,
  useState,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { Store } from "../../context/Store";
/* import { getError } from "../../utils"; */
/* import { Product } from '../types/Product'; */ // Import your Product type if you have one
/* import { ApiError } from "../../types/ApiError"; */
import Loading from "../../components/Loading/Loading";
import { Helmet } from "react-helmet-async";
/* import apiClient from "../../apiClient"; */
import "./ProductEditPage.css";

// Define the state and action types
interface State {
  loading: boolean;
  error: string;
  loadingUpdate: boolean;
  loadingUpload: boolean;
  errorUpload: string;
}

interface FormData {
  name: string;
  slug: string;
  description: string;
  price: string;
  category: string;
  countInStock: string;
  brand: string;
  image: File | null;
}

interface Action {
  type:
    | "FETCH_REQUEST"
    | "FETCH_SUCCESS"
    | "FETCH_FAIL"
    | "UPDATE_REQUEST"
    | "UPDATE_SUCCESS"
    | "UPDATE_FAIL"
    | "UPLOAD_REQUEST"
    | "UPLOAD_SUCCESS"
    | "UPLOAD_FAIL";
  payload?: any;
}

// Define the reducer function
const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "UPDATE_REQUEST":
      return { ...state, loadingUpdate: true };
    case "UPDATE_SUCCESS":
      return { ...state, loadingUpdate: false };
    case "UPDATE_FAIL":
      return { ...state, loadingUpdate: false };
    case "UPLOAD_REQUEST":
      return { ...state, loadingUpload: true, errorUpload: "" };
    case "UPLOAD_SUCCESS":
      return { ...state, loadingUpload: false, errorUpload: "" };
    case "UPLOAD_FAIL":
      return { ...state, loadingUpload: false, errorUpload: action.payload };
    default:
      return state;
  }
};

const ProductEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { id: productId } = useParams<{ id: string }>();
  const { state } = useContext(Store);
  const { userInfo } = state;

  const [formData, setFormData] = useState<FormData>({
    name: "",
    slug: "",
    description: "",
    price: "",
    image: null,
    category: "",
    countInStock: "",
    brand: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, files } = e.target as HTMLInputElement; // Ensure correct casting to HTMLInputElement
    if (name === "image") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: files ? files[0] : null, // Access files property safely
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };
  const [{ loading, error, loadingUpdate }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
    loadingUpdate: false,
    loadingUpload: false,
    errorUpload: "",
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", formData.name);
    data.append("slug", formData.slug);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("category", formData.category);
    data.append("countInStock", formData.countInStock);
    data.append("brand", formData.brand);
    if (formData.image) {
      data.append("image", formData.image);
    }

    try {
      await axios.post(
        "https://e-commerce-backend-9q5u.onrender.com/api/products",
        data,
        {
          withCredentials: true, // Include cookies in requests
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${userInfo?.token}`,
          },
        }
      );
      toast.success("Service upload successful!");
      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="product-edit-container">
      <Helmet>
        <title>Edit Product {productId}</title>
      </Helmet>
      <h1 className="product-edit-title">Edit Product</h1>

      {loading ? (
        <Loading />
      ) : error ? (
        <div className="error">There was an error: {error}</div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="product-edit-form-group">
            <label htmlFor="name" className="product-edit-form-label">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              onChange={handleChange}
              className="product-edit-form-input"
              required
            />
          </div>
          <div className="product-edit-form-group">
            <label htmlFor="slug" className="product-edit-form-label">
              Slug
            </label>
            <input
              type="text"
              id="slug"
              name="slug"
              onChange={handleChange}
              className="product-edit-form-input"
              required
            />
          </div>
          <div className="product-edit-form-group">
            <label htmlFor="price" className="product-edit-form-label">
              Price(KSH)
            </label>
            <input
              type="text"
              id="price"
              name="price"
              onChange={handleChange}
              className="product-edit-form-input"
              required
            />
          </div>
          <div className="product-edit-form-group">
            <label htmlFor="image" className="product-edit-form-label">
              Image File
            </label>
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleChange}
              className="product-edit-form-input"
              required
            />
          </div>
          <div className="product-edit-form-group">
            <label htmlFor="category" className="product-edit-form-label">
              Category
            </label>
            <input
              type="text"
              id="category"
              name="category"
              onChange={handleChange}
              className="product-edit-form-input"
              required
            />
          </div>
          <div className="product-edit-form-group">
            <label htmlFor="brand" className="product-edit-form-label">
              Brand
            </label>
            <input
              type="text"
              id="brand"
              name="brand"
              onChange={handleChange}
              className="product-edit-form-input"
              required
            />
          </div>
          <div className="product-edit-form-group">
            <label htmlFor="countInStock" className="product-edit-form-label">
              Count In Stock
            </label>
            <input
              type="text"
              id="countInStock"
              name="countInStock"
              onChange={handleChange}
              className="product-edit-form-input"
              required
            />
          </div>
          <div className="product-edit-form-group">
            <label htmlFor="description" className="product-edit-form-label">
              Description
            </label>
            <textarea
              id="description"
              onChange={handleChange}
              name="description"
              className="product-edit-form-textarea"
              required
            />
          </div>
          <div className="mb-3">
            <button
              type="submit"
              disabled={loadingUpdate}
              className="product-edit-form-button"
            >
              Update
            </button>
            {loadingUpdate && <Loading />}
          </div>
        </form>
      )}
    </div>
  );
};

export default ProductEditPage;
