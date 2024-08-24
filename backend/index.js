const express = require("express");
const app = express();
const PORT = 3000;
const { rootRouter } = require("./routes/index");

app.use('/api/v1', router);

app.listen(PORT, function (err) {
    if (err) console.log(err);
    console.log("Server listening on PORT", PORT);
});