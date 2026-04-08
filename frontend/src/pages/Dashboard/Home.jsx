import { useEffect, useState } from "react";
import LedgerLayout from "../../components/layouts/LedgerLayout";
import { useUserAuth } from "../../hooks/useUserAuth";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utlis/axiosInstance";
import { API_PATHS } from "../../utlis/apiPaths";
import InfoCard from "../../components/Cards/InfoCard";
import { addThousandsSeparator } from "../../utlis/helper";
import RecentTransactions from "../../components/Dashboard/RecentTransactions";
import { LuHandCoins, LuWalletMinimal } from "react-icons/lu";
import { IoMdCard } from "react-icons/io";
import FinanceOverview from "../../components/Dashboard/FinanceOverview";
import ExpenseTransactions from "../../components/Dashboard/ExpenseTransactions";
import Previous30DaysTransactions from "../../components/Dashboard/Previous30DaysTransactions";
import RecentIncomeWithChart from "../../components/Dashboard/RecentIncomeWithChart";
import RecentIncome from "../../components/Dashboard/RecentIncome";
import HoverCarousel from "../../components/Dashboard/HoverCarousel";
import AIInsightsWidget from "../../components/Dashboard/AIInsightsWidget";
import { motion } from "framer-motion";
import moment from "moment";

const stagger = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.08 },
    },
};

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function Home() {
    useUserAuth();

    const navigate = useNavigate();

    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchDashboardData = async () => {
        if (loading) return;

        setLoading(true);

        try {
            const response = await axiosInstance.get(`${API_PATHS.DASHBOARD.GET_DATA}`);

            if (response.data) {
                setDashboardData(response.data);
            }
        } catch (error) {
            console.log("Something went wrong. Please try again", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchDashboardData();
        return () => {}
    }, [])

    return (
        <LedgerLayout activeMenu="Dashboard">
            <motion.div
                variants={stagger}
                initial="hidden"
                animate="show"
                className="space-y-6"
            >
                {/* Page Header */}
                <motion.div variants={fadeUp} className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
                        <p className="text-sm text-text-muted mt-1">
                            Welcome back! Here's your financial overview.
                        </p>
                    </div>
                    <div className="hidden sm:block text-right">
                        <p className="text-xs text-text-muted">{moment().format("dddd, MMMM Do YYYY")}</p>
                    </div>
                </motion.div>

                {/* Tilt Cards Row */}
                <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <InfoCard
                        icon={<IoMdCard />}
                        label="Ledger Balance"
                        value={addThousandsSeparator(dashboardData?.totalBalance || 0)}
                        color="bg-gradient-to-br from-primary to-primary-dark"
                        glowColor="purple"
                        trend="up"
                    />

                    <InfoCard
                        icon={<LuWalletMinimal />}
                        label="Total Income"
                        value={addThousandsSeparator(dashboardData?.totalIncome || 0)}
                        color="bg-gradient-to-br from-accent to-accent-dark"
                        glowColor="green"
                        trend="up"
                    />

                    <InfoCard
                        icon={<LuHandCoins />}
                        label="Total Expense"
                        value={addThousandsSeparator(dashboardData?.totalExpense || 0)}
                        color="bg-gradient-to-br from-danger to-red-700"
                        glowColor="red"
                        trend="down"
                    />
                </motion.div>

                {/* Hover Carousel — Recent Ledger Entries */}
                <motion.div variants={fadeUp}>
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-lg font-semibold text-text-primary">Recent Ledger Entries</h2>
                        <button className="card-btn" onClick={() => navigate("/expense")}>
                            View All
                        </button>
                    </div>
                    <HoverCarousel>
                        {(dashboardData?.recentTransactions || []).map((item) => (
                            <div
                                key={item._id}
                                className="flex-shrink-0 w-[280px] glass-card p-4 hover:border-primary/30 transition-all duration-200 group cursor-pointer"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 flex items-center justify-center text-lg bg-surface-elevated rounded-xl border border-border-subtle">
                                        {item.icon ? (
                                            <img src={item.icon} alt={item.type === "expense" ? item.category : item.source} className="w-5 h-5" />
                                        ) : (
                                            <span>{item.type === "expense" ? "💸" : "💰"}</span>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-text-primary truncate">
                                            {item.type === "expense" ? item.category : item.source}
                                        </p>
                                        <p className="text-xs text-text-muted">
                                            {moment(item.date).format("MMM Do, YYYY")}
                                        </p>
                                    </div>
                                    <span className={`text-sm font-semibold ${item.type === "income" ? "text-accent-light" : "text-danger-light"}`}>
                                        {item.type === "income" ? "+" : "-"}${addThousandsSeparator(item.amount)}
                                    </span>
                                </div>
                            </div>
                        ))}
                        {(!dashboardData?.recentTransactions || dashboardData.recentTransactions.length === 0) && (
                            <div className="flex-shrink-0 w-full glass-card p-6 text-center text-text-muted">
                                No recent transactions yet. Start adding entries!
                            </div>
                        )}
                    </HoverCarousel>
                </motion.div>

                {/* AI Insights */}
                <motion.div variants={fadeUp}>
                    <AIInsightsWidget dashboardData={dashboardData} />
                </motion.div>

                {/* Charts Grid */}
                <motion.div variants={fadeUp} className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    <RecentTransactions
                        transactions={dashboardData?.recentTransactions || []}
                        onSeeMore={() => navigate("/expense")}
                    />

                    <FinanceOverview
                        totalBalance={dashboardData?.totalBalance || 0}
                        totalIncome={dashboardData?.totalIncome || 0}
                        totalExpense={dashboardData?.totalExpense || 0}
                    />

                    <ExpenseTransactions
                        transactions={dashboardData?.last30DaysExpenses?.transactions || []}
                        onSeeMore={() => navigate("/expense")}
                    />

                    <Previous30DaysTransactions
                        data={dashboardData?.last30DaysExpenses?.transactions || []}
                    />

                    <RecentIncomeWithChart
                        data={dashboardData?.last60DaysIncome?.transactions?.slice(0, 4) || []}
                        totalIncome={dashboardData?.totalIncome || 0}
                    />

                    <RecentIncome
                        transactions={dashboardData?.last60DaysIncome?.transactions || []}
                        onSeeMore={() => navigate("/income")}
                    />
                </motion.div>
            </motion.div>
        </LedgerLayout>
    )
}