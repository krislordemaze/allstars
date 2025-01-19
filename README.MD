Please see api.js > api wrapper for basic crud implementations.

quick example for adding new record(keep in mind the main storage key is "items" as can be modified later or have multiple keys):

const newItem = {
playerName: "zed99",
grade: "S+"
};

api.addRecord("items", newItem).then(result => {
if (result.success) {
console.log("New record added with ID:", result.id);
}
});
