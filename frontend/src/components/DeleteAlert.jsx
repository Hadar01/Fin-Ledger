export default function DeleteAlert ({ content, onDelete }) {
    return (
        <div>
            <p className="text-text-secondary">{content}</p>
            <div className="flex justify-end gap-3 mt-6">
                <button
                    type="button"
                    className="add-btn add-btn-fill !bg-gradient-to-r !from-danger !to-red-700 !shadow-danger/25"
                    onClick={onDelete}
                >
                    Delete
                </button>
            </div>
        </div>
    )
}