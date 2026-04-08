import { useEffect, useState } from "react";
import LedgerLayout from "../../components/layouts/LedgerLayout";
import axiosInstance from "../../utlis/axiosInstance";
import { API_PATHS } from "../../utlis/apiPaths";
import IncomeOverview from "../../components/Income/IncomeOverview";
import Modal from "../../components/Modal";
import AddIncomeForm from "../../components/Income/AddIncomeForm";
import { toast } from "react-hot-toast";
import IncomeList from "../../components/Income/IncomeList";
import DeleteAlert from "../../components/DeleteAlert";
import { useUserAuth } from "../../hooks/useUserAuth";
import { motion } from "framer-motion";

export default function Income() {
    useUserAuth();
    const [incomeData, setIncomeData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openDeleteAlert, setOpenDeleteAlert] = useState({
        show: false,
        data: null
    });
    const [openAddIncomeModal, setOpenAddIncomeModal] = useState(false);

    const fetchIncomeDetails = async () => {
        if (loading) return;
        setLoading(true);

        try {
            const response = await axiosInstance.get(
                `${API_PATHS.INCOME.GET_ALL_INCOME}`
            );
            if (response.data) {
                setIncomeData(response.data);
            }
        } catch (error) {
            console.log("something went wrong. Please try again", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddIncome = async (income) => {
        const { source, amount, date, icon} = income;

        if (!source.trim()) {
            toast.error("Source is required");
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
            await axiosInstance.post(API_PATHS.INCOME.ADD_INCOME, {
                source, amount, date, icon
            });

            setOpenAddIncomeModal(false);
            toast.success("Income added successfully");
            fetchIncomeDetails();
        } catch (error) {
            console.error("Error adding income: ", error.response?.data?.message || error.message);
        }
    };

    const deleteIncome = async (id) => {
        try {
            await axiosInstance.delete(API_PATHS.INCOME.DELETE_INCOME(id));

            setOpenDeleteAlert({ show: false, data: null });
            toast.success("Income details deleted successfully");
            fetchIncomeDetails();
        } catch (error) {
            console.error("error deleting incomes", error.response?.data?.message || error.message);
        }
    };

    const handleDownloadIncomeDetails = async () => {
        try {
            const response = await axiosInstance.get(
                API_PATHS.INCOME.DOWNLOAD_INCOME,
                { responseType: "blob" }
            );

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "income_details.xlsx");
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error downloading income details: ", error);
            toast.error("Failed to download income details. Please try again.");
        }
    };

    useEffect(() => {
        fetchIncomeDetails();
        return () => {};
    }, []);

    return (
        <LedgerLayout activeMenu="Income">
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
            >
                <div>
                    <h1 className="text-2xl font-bold text-text-primary">Income</h1>
                    <p className="text-sm text-text-muted mt-1">Track and manage your earning sources</p>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    <IncomeOverview
                        transactions={incomeData}
                        onAddIncome={() => setOpenAddIncomeModal(true)}
                    />
                    <IncomeList
                        transactions={incomeData}
                        onDelete={(id) => {
                            setOpenDeleteAlert({ show: true, data: id });
                        }}
                        onDownload={handleDownloadIncomeDetails}
                    />
                </div>

                <Modal
                    isOpen={openAddIncomeModal}
                    onClose={() => setOpenAddIncomeModal(false)}
                    title="Add Income"
                >
                    <AddIncomeForm onAddIncome={handleAddIncome} />
                </Modal>
                <Modal
                    isOpen={openDeleteAlert.show}
                    onClose={() => setOpenDeleteAlert({ show: false, data: null })}
                    title="Delete Income"
                >
                    <DeleteAlert
                        content="Are you sure you want to delete this income?"
                        onDelete={() => deleteIncome(openDeleteAlert.data)}
                    />
                </Modal>
            </motion.div>
        </LedgerLayout>
    )
}