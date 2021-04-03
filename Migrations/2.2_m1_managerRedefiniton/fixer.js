const fs = require('fs');

fs.readdir("./data", async (error, directories) => {
    if (error) {
        console.error(error);
    }

    for await (const directory of directories) {
        fs.rm(`./data/${directory}/managerRoleID.txt`, {}, (error) => {
            if (error) {
                console.error(error);
            }
        })
        console.log(`managerRoleID.txt deleted for ${directory}`);
    }
})
