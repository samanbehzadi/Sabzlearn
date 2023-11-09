import React, { useEffect, useState } from "react";
import swal from "sweetalert";

import DataTable from "../../../Components/AdminPanel/DataTable/DataTable";
import { requiredValidator, minValidator, maxValidator, emailValidator } from "../../../Validators/Rules";
import Input from "./../../../Components/Form/Input";
import { useForm } from "./../../../hooks/useForm";

export default function Users() {
    const [users, setUsers] = useState([]);
    const [formState, onInputHandler] = useForm({
        name: { value: "", isValid: false },
        username: { value: "", isValid: false },
        email: { value: "", isValid: false },
        password: { value: "", isValid: false },
        phone: { value: "", isValid: false }
    },
        false
    );
    const [hasUserAccess, setHasUserAccess] = useState(true)

    useEffect(() => {
        getAllUsers();
    }, []);

    function getAllUsers() {
        const localStorageData = JSON.parse(localStorage.getItem("user"));
        fetch(`http://localhost:4000/v1/users`, {
            headers: { Authorization: `Bearer ${localStorageData.token}` }
        })
            .then((res) => res.json())
            .then((allUsers) => {
                setUsers(allUsers);
            });
    }

    const removeUser = userID => {
        const localStorageData = JSON.parse(localStorage.getItem("user"));
        swal({ title: "آیا از حذف مطمعنی؟", icon: "warning", buttons: ["نه", "آره"] })
            .then(swalResult => {
                if (swalResult) {
                    fetch(`http://localhost:4000/v1/users/${userID}`, {
                        method: "DELETE",
                        headers: { Authorization: `Bearer ${localStorageData.token}` }
                    }).then(res => {
                        if (res.ok) {
                            swal({ title: "کاربر با موفقیت حذف شد", icon: "success", buttons: "اوکی" })
                                .then(() => getAllUsers());
                        }
                    });
                }
            });
    };

    const banUser = userID => {
        const localStorageData = JSON.parse(localStorage.getItem("user"));
        swal({ title: "آیا از بن مطمعنی؟", icon: "warning", buttons: ["نه", "آره"] })
            .then(result => {
                if (result) {
                    fetch(`http://localhost:4000/v1/users/ban/${userID}`, {
                        method: "PUT",
                        headers: { Authorization: `Bearer ${localStorageData.token}` }
                    }).then(res => {
                        if (res.ok) {
                            swal({ title: "کاربر با موفقیت بن شد", icon: "success", buttons: "اوکی" })
                                .then(() => setHasUserAccess(false))
                        }
                    });
                }
            });
    };

    const registerNewUser = event => {
        event.preventDefault();
        const newUserInfo = {
            name: `${formState.inputs.name.value}`,
            username: formState.inputs.username.value,
            email: formState.inputs.email.value,
            phone: formState.inputs.phone.value,
            password: formState.inputs.password.value,
            confirmPassword: formState.inputs.password.value
        };

        fetch("http://localhost:4000/v1/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newUserInfo)
        })
            .then(res => {
                return res.json();
            })
            .then(result => {
                swal({ title: "کاربر مورد نظر با موفقیت اضافه شد", icon: "success", buttons: "اوکی" });
                getAllUsers();
            })};

    return (
        <>
            <div className="home-content-edit">
                <div className="back-btn">
                    <i className="fas fa-arrow-right"></i>
                </div>
                <form className="form">
                    <div className="col-6">
                        <div className="name input">
                            <label className="input-title">نام و نام خانوادگی</label>
                            <Input type="text" className="" id="name" element="input"
                                validations={[
                                    requiredValidator(),
                                    minValidator(8),
                                    maxValidator(20)
                                ]}
                                onInputHandler={onInputHandler}
                                placeholder="لطفا نام و نام خانوادگی کاربر را وارد کنید..."
                            />
                            <span className="error-message text-danger"></span>
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="family input">
                            <label className="input-title">نام کاربری</label>
                            <Input type="text" className="" id="username" element="input"
                                validations={[
                                    requiredValidator(),
                                    minValidator(8),
                                    maxValidator(20)
                                ]}
                                onInputHandler={onInputHandler}
                                placeholder="لطفا نام کاربری را وارد کنید..."
                            />
                            <span className="error-message text-danger"></span>
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="email input">
                            <label className="input-title">ایمیل</label>
                            <Input type="text" className="" id="email" element="input"
                                validations={[
                                    requiredValidator(),
                                    minValidator(8),
                                    maxValidator(20),
                                    emailValidator()
                                ]}
                                onInputHandler={onInputHandler}
                                placeholder="لطفا ایمیل کاربر را وارد کنید..."
                            />
                            <span className="error-message text-danger"></span>
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="password input">
                            <label className="input-title">رمز عبور</label>
                            <Input type="text" className="" id="password" element="input"
                                validations={[
                                    requiredValidator(),
                                    minValidator(8),
                                    maxValidator(20)
                                ]}
                                onInputHandler={onInputHandler}
                                placeholder="لطفا رمز عبور کاربر را وارد کنید..."
                            />
                            <span className="error-message text-danger"></span>
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="phone input">
                            <label className="input-title">شماره تلفن</label>
                            <Input type="text" className="" id="phone" element="input"
                                validations={[
                                    requiredValidator(),
                                    minValidator(8),
                                    maxValidator(20)
                                ]}
                                onInputHandler={onInputHandler}
                                placeholder="لطفا شماره تلفن کاربر را وارد کنید..."
                            />
                            <span className="error-message text-danger"></span>
                        </div>
                    </div>
                    <div className="col-12">
                        <div className="bottom-form">
                            <div className="submit-btn">
                                <input type="submit" value="افزودن" onClick={registerNewUser} />
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <DataTable title="کاربران">
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th>شناسه</th>
                            <th>نام و نام خانوادگی</th>
                            <th>ایمیل</th>
                            <th>ویرایش</th>
                            <th>حذف</th>
                            <th>بن</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr>
                                <td>{index + 1}</td>
                                <td>{user.name}</td>
                                {/* <td>09123443243</td> */}
                                <td>{user.email}</td>
                                <td>
                                    <button type="button" className="btn btn-primary edit-btn">
                                        ویرایش
                                    </button>
                                </td>
                                <td>
                                    <button
                                        type="button"
                                        className="btn btn-danger delete-btn"
                                        onClick={() => removeUser(user._id)}
                                    >
                                        حذف
                                    </button>
                                </td>
                                <td>
                                    <button
                                        type="button"
                                        className={`btn delete-btn btn-secondary`}
                                        onClick={() => banUser(user._id)}
                                    >
                                        بن
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </DataTable>
        </>
    );
}
