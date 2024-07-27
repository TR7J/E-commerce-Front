E-commerce website!

export const sparesController = async (req: AuthRequest, res: Response) => {
try {
if (!req.user || req.user.role !== "admin") {
return res.status(403).json({ message: "Unauthorized" });
}

    const { name, description, price } = req.body;
    const image = req.file
      ? /* req.file.path   */ `/uploads/${req.file.filename}`
      : "";
    const spares = new SpareParts({ name, description, price, image });
    await spares.save();
    res.status(200).json({ message: "Spares created successfully", spares });

} catch (error) {
res.status(500).json({ message: "Error creating spares", error });
}
};

// Route for posting spare parts
router.post(
"/service/spares",
authMiddleware(["admin"]),
upload.single("image"),
sparesController
);

interface FormData {
name: string;
description: string;
price: string;
image: File | null;
}

const AddNewSpares: React.FC = () => {
const [formData, setFormData] = useState<FormData>({
name: "",
description: "",
price: "",
image: null,
});
const [isSidebarOpen, setIsSidebarOpen] = useState(false);
const navigate = useNavigate();

const handleToggleSidebar = () => {
setIsSidebarOpen(!isSidebarOpen);
};

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

const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
e.preventDefault();
const data = new FormData();
data.append("name", formData.name);
data.append("description", formData.description);
data.append("price", formData.price);
if (formData.image) {
data.append("image", formData.image);
}

    try {
      await axios.post("http://localhost:8000/api/admin/service/spares", data, {
        withCredentials: true, // Include cookies in requests
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Service upload successful!");
      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Error:", error);
    }

};

return (
<>

<div className="admin-dashboard">
<div className="top-buttons">
<button className="toggle-btn" onClick={handleToggleSidebar}>
{isSidebarOpen ? "X" : "☰"}
</button>
</div>
<div className={`sidebar ${isSidebarOpen ? "sidebar-open" : ""}`}>
<ul>
<li className="admin-links">
<Link to={"/admin/vieworders"}>View Orders</Link>
</li>
<li className="admin-links">
<Link to={"/admin/manageorders"}>Manage Orders</Link>
</li>
<li className="admin-links">
<Link to={"/admin/manageworkers"}>Manage Workers</Link>
</li>
<li className="admin-links">
<Link to={"/admin/createworkersaccounts"}>Add New Workers</Link>
</li>
<li className="admin-links">
<Link to={"/admin/addnewservices"}>Add New Services</Link>
</li>
<li className="admin-links">
<Link to={"/admin/addnewspares"}>Add New Spares</Link>
</li>
</ul>
</div>
</div>
<form onSubmit={handleSubmit}>
<div className="authenticate-users-container">
<div className="details">
<h1 className="large-details">
Add a new spare part to your website
</h1>
<h3 className="small-details">
This spare part will be sold to clients
</h3>
</div>
<div className="input-container">
<div className="labels-input">
<label className="input-labels">Name</label>
<input
                name="name"
                type="text"
                className="input"
                onChange={handleChange}
              />
</div>
<div className="line"></div>
</div>

          <div className="input-container">
            <div className="labels-input">
              <label className="input-labels">Description</label>
              <input
                name="description"
                className="input"
                onChange={handleChange}
              />
            </div>
            <div className="line"></div>
          </div>

          <div className="input-container">
            <div className="labels-input">
              <label className="input-labels">Price (Ksh)</label>
              <input
                name="price"
                type="text"
                className="input"
                onChange={handleChange}
              />
            </div>
            <div className="line"></div>
          </div>

          <div className="input-container">
            <div className="labels-input">
              <label className="input-labels">Image</label>
              <input
                name="image"
                type="file"
                className="input"
                onChange={handleChange}
              />
            </div>
            <div className="line"></div>
          </div>

          <button type="submit" className="sign-up-log-in-btn">
            Upload Spare Part
          </button>
        </div>
      </form>
    </>

);
};

export default AddNewSpares;

export const createProduct = async (req: Request, res: Response) => {
try {
const {
name,
slug,
price,
category,
brand,
countInStock,
rating,
numberOfReviews,
description,
} = req.body;
const image = req.file
? /_ req.file.path _/ `/uploads/${req.file.filename}`
: "";
const newProduct = new Product({
name,
slug,
image,
price,
category,
brand,
countInStock,
rating,
numberOfReviews,
description,
});
await newProduct.save();
res.status(201).send({ message: "Product Created", newProduct });
} catch (error) {
res.status(500).send({ message: "Error creating product", error });
}
};

export const createProduct = async (req: Request, res: Response) => {
try {
const newProduct = new Product({
name: "sample name " + Date.now(),
slug: "sample-name-" + Date.now(),
image: "/images/p1.jpg",
price: 2000,
category: "sample category",
brand: "sample brand",
countInStock: 0,
rating: 0,
numberOfReviews: 0,
description: "sample description",
});
const product = await newProduct.save();
res.status(201).send({ message: "Product Created", product });
} catch (error) {
res.status(500).send({ message: "Error creating product", error });
}
};

import React, { useContext, useEffect, useReducer, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { Store } from "../../context/Store";
import { getError } from "../../utils";
/_ import { Product } from '../types/Product'; _/ // Import your Product type if you have one
import { ApiError } from "../../types/ApiError";
import Loading from "../../components/Loading/Loading";
import { Helmet } from "react-helmet-async";
import apiClient from "../../apiClient";
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
description: string;
price: string;
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

const [
{ loading, error, loadingUpdate, loadingUpload /* errorUpload */ },
dispatch,
] = useReducer(reducer, {
loading: true,
error: "",
loadingUpdate: false,
loadingUpload: false,
errorUpload: "",
});

const [name, setName] = useState<string>("");
const [slug, setSlug] = useState<string>("");
const [price, setPrice] = useState<string>("");
const [image, setImage] = useState<string>("");
/_ const [images, setImages] = useState<string[]>([]); _/
const [category, setCategory] = useState<string>("");
const [countInStock, setCountInStock] = useState<string>("");
const [brand, setBrand] = useState<string>("");
const [description, setDescription] = useState<string>("");

useEffect(() => {
const fetchData = async () => {
try {
dispatch({ type: "FETCH_REQUEST" });
const { data } = await apiClient.get(`/api/products/${productId}`);
setName(data.name);
setSlug(data.slug);
setPrice(data.price);
setImage(data.image);
/_ setImages(data.images); _/
setCategory(data.category);
setCountInStock(data.countInStock);
setBrand(data.brand);
setDescription(data.description);
dispatch({ type: "FETCH_SUCCESS" });
} catch (err) {
dispatch({
type: "FETCH_FAIL",
payload: getError(err as ApiError),
});
}
};
fetchData();
}, [productId]);

const submitHandler = async (e: React.FormEvent) => {
e.preventDefault();
try {
dispatch({ type: "UPDATE_REQUEST" });
await apiClient.put(
`/api/products/${productId}`,
{
\_id: productId,
name,
slug,
price,
image,
category,
brand,
countInStock,
description,
},
{
headers: { Authorization: `Bearer ${userInfo?.token}` },
}
);
dispatch({ type: "UPDATE_SUCCESS" });
toast.success("Product updated successfully");
navigate("/admin/products");
} catch (err) {
toast.error(getError(err as ApiError));
dispatch({ type: "UPDATE_FAIL" });
}
};

const uploadFileHandler = async (
e: React.ChangeEvent<HTMLInputElement>,
forImages: boolean
) => {
const file = e.target.files?.[0];
if (!file) return;

    const bodyFormData = new FormData();
    bodyFormData.append("file", file);

    try {
      dispatch({ type: "UPLOAD_REQUEST" });
      const { data } = await axios.post(
        "https://e-commerce-backend-9q5u.onrender.com/api/upload",
        bodyFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${userInfo?.token}`,
          },
        }
      );
      dispatch({ type: "UPLOAD_SUCCESS" });

      if (!forImages) {
        // setImages([...images, data.image]);
        setImage(data.image);
      } else {
        /* setImages([...images, data.image]); */
      }
      toast.success("Image uploaded successfully. Click Update to apply it");
    } catch (err) {
      toast.error(getError(err as ApiError));
      dispatch({ type: "UPLOAD_FAIL", payload: getError(err as ApiError) });
    }

};

return (
<div className="product-edit-container">
<Helmet>
<title>Edit Product {productId}</title>
</Helmet>
<h1 className="product-edit-title">Edit Product : {name}</h1>

      {loading ? (
        <Loading />
      ) : error ? (
        <div className="error">There was an error: {error}</div>
      ) : (
        <form onSubmit={submitHandler}>
          <div className="product-edit-form-group">
            <label htmlFor="name" className="product-edit-form-label">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
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
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="product-edit-form-input"
              required
            />
          </div>
          <div className="product-edit-form-group">
            <label htmlFor="image" className="product-edit-form-label">
              Image File
            </label>
            <input
              type="text"
              id="image"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="product-edit-form-input"
              required
            />
          </div>
          <div className="product-edit-form-group">
            <label htmlFor="imageFile" className="product-edit-form-label">
              Upload Image
            </label>
            <input
              type="file"
              id="imageFile"
              name="file"
              onChange={(e) => uploadFileHandler(e, false)}
              className="product-edit-form-file-input"
            />
            {loadingUpload && <Loading />}
          </div>

          <div className="product-edit-form-group">
            <label htmlFor="category" className="product-edit-form-label">
              Category
            </label>
            <input
              type="text"
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
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
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
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
              value={countInStock}
              onChange={(e) => setCountInStock(e.target.value)}
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
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
