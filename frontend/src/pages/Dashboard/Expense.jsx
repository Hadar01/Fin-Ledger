import { useUserAuth } from "../../hooks/useUserAuth";
import LedgerLayout from "../../components/layouts/LedgerLayout";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import axiosInstance from "../../utlis/axiosInstance";
import { API_PATHS } from "../../utlis/apiPaths";
import ExpenseOverview from "../../components/Expense/ExpenseOverview";
import Modal from '../../components/Modal'
import AddExpenseForm from "../../components/Expense/AddExpenseForm";
import ExpenseList from "../../components/Expense/ExpenseList";
import DeleteAlert from "../../components/DeleteAlert";
import { motion } from "framer-motion";

export default function Expense() {
    useUserAuth();
    const [expenseData, setExpenseData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openDeleteAlert, setOpenDeleteAlert] = useState({
        show: false,
        data: null
    });
    const [openAddExpenseModal, setOpenAddExpenseModal] = useState(false);
    
    const fetchExpenseDetails = async () => {
        if (loading) return;
        setLoading(true);

        try {
            const response = await axiosInstance.get(
                `${API_PATHS.EXPENSE.GET_ALL_EXPENSE}`
            );
            if (response.data) {
                setExpenseData(response.data);
            }
        } catch (error) {
            console.log("something went wrong. Please try again", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddExpense = async (expense) => {
        const { category, amount, date, icon} = expense;

        if (!category.trim()) {
            toast.error("Category is required");
            return;
        }
        if (!amount || isNaN(amount) || Number(amount) <= 0) {
            toast.error("Amount should be a valid number greater than 0");
            return;
        }
        if (!date) {
            toast.error("Date is required");
            return;
        }

        try {
            await axiosInstance.post(API_PATHS.EXPENSE.ADD_EXPENSE, {
                category, amount, date, icon
            });

            setOpenAddExpenseModal(false);
            toast.success("Expense added successfully");
            fetchExpenseDetails();
        } catch (error) {
            console.error("Error adding expense: ", error.response?.data?.message || error.message);
        }
    };

    const deleteExpense = async (id) => {
        try {
            await axiosInstance.delete(API_PATHS.EXPENSE.DELETE_EXPENSE(id));
    
            setOpenDeleteAlert({ show: false, data: null });
            toast.success("Expense details deleted successfully");
            fetchExpenseDetails();
        } catch (error) {
            console.error("error deleting expense", error.response?.data?.message || error.message);
        }
    };

    const handleDownloadExpenseDetails = async () => {
        try {
            const response = await axiosInstance.get(
                API_PATHS.EXPENSE.DOWNLOAD_EXPENSE,
                { responseType: "blob" }
            );

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "expense_details.xlsx");
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error downloading expense details: ", error);
            toast.error("Failed to download expense details. Please try again.");
        }
    };

    useEffect(() => {
        fetchExpenseDetails();
        return () => {};
    }, []);

    return (
        <LedgerLayout activeMenu="Expense">
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
            >
                <div>
                    <h1 className="text-2xl font-bold text-text-primary">Expenses</h1>
                    <p className="text-sm text-text-muted mt-1">Track and manage your spending</p>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    <ExpenseOverview
                        transactions={expenseData}
                        onExpenseIncome={() => setOpenAddExpenseModal(true)}
                    />
                    <ExpenseList
                        transactions={expenseData}
                        onDelete={(id) => {
                            setOpenDeleteAlert({ show: true, data: id });
                        }}
                        onDownload={handleDownloadExpenseDetails}
                    />
                </div>

                <Modal
                    isOpen={openAddExpenseModal}
                    onClose={() => setOpenAddExpenseModal(false)}
                    title="Add Expense"
                >
                    <AddExpenseForm onAddExpense={handleAddExpense} />
                </Modal>
                <Modal
                    isOpen={openDeleteAlert.show}
                    onClose={() => setOpenDeleteAlert({ show: false, data: null })}
                    title="Delete Expense"
                >
                    <DeleteAlert
                        content="Are you sure you want to delete this expense?"
                        onDelete={() => deleteExpense(openDeleteAlert.data)}
                    />
                </Modal>
            </motion.div>
        </LedgerLayout>
    )
}