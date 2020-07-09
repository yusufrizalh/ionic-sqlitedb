import { Component, OnInit } from "@angular/core";
import { SQLite, SQLiteObject } from "@ionic-native/sqlite/ngx";
import { Platform } from "@ionic/angular";
import { FormBuilder, FormArray, FormGroup, Validators } from "@angular/forms";
@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
})
export class HomePage implements OnInit {
  databaseObj: SQLiteObject;
  readonly database_name: string = "database14.db";
  readonly table_name: string = "mytable14";

  first_name: string = "";
  address: string = "";
  pan: string = "";
  email: string = "";
  phone: number;
  flag: boolean = false;

  row_data: any = [];

  // Handle Update Row Operation
  updateActive: boolean;
  to_update_item: any;
  // public form : FormGroup;

  // public addresses: any[] = [{
  //   id: 1,
  //   address: '',
  //   street: '',
  //   city: '',
  //   country: ''
  // }];
  constructor(
    private platform: Platform,
    private sqlite: SQLite
  ) // private _FB : FormBuilder
  {
    this.platform
      .ready()
      .then(() => {
        this.createDB();
      })
      .catch((error) => {
        console.log(error);
      });

    this.platform.pause.subscribe((e) => {
      this.insertRowBackground();
    });
  }
  // Create DB if not there
  createDB() {
    this.sqlite
      .create({
        name: this.database_name,
        location: "default",
      })
      .then((db: SQLiteObject) => {
        this.databaseObj = db;
        // alert('Database Created!');
        this.createTable();
        this.getRows();
      })
      .catch((e) => {
        alert("error " + JSON.stringify(e));
      });
  }

  ngOnInit() {}
  // Create table
   createTable() {
    this.databaseObj.executeSql(`
    CREATE TABLE IF NOT EXISTS ${this.table_name}  (pid INTEGER PRIMARY KEY, Name varchar(255))
    `, [])
      .then(() => {
        alert('Table Created!');
      })
      .catch(e => {
        alert("error " + JSON.stringify(e))
      });
  }

  // createTable() {
  //   var q =
  //     "CREATE TABLE IF NOT EXISTS mytable14 (pid INTEGER PRIMARY KEY, Name varchar(255), Address varchar(255), Pan varchar(255))";
  //   this.databaseObj
  //     .executeSql(q, [])
  //     .then(() => {
  //       // alert('Table Created!');
  //     })
  //     .catch((e) => {
  //       alert("error " + JSON.stringify(e));
  //     });
  // }
  //Inset row in the table
  insertRow() {
    // Value should not be empty
    // if (!this.first_name.length) {
    //   alert("Enter Name");
    //   return;
    // }

    // this.databaseObj.executeSql(`
    //   INSERT INTO ${this.table_name} (Name) VALUES ('${this.name_model}')
    // `, [])
    //   .then(() => {
    //     alert('Row Inserted!');
    //     this.getRows();
    //   })
    //   .catch(e => {
    //     alert("error " + JSON.stringify(e))
    //   });

    if (!this.first_name) {
      alert("Enter Name");
      return;
    } else if (!this.address) {
      alert("Enter Address");
      return;
    } else if (!this.pan) {
      alert("Enter Pan");
      return;
    }

    // else if(this.first_name.length){

    // }
    // var q2='DELETE FROM mytable8 WHERE pid=1'
    // this.databaseObj.executeSql(q2,[]) .then(() => {
    //   alert('Saving');
    // })
    else {
      if (this.first_name && this.address && this.pan) {
        var q2 = "DELETE FROM mytable14 WHERE pid=1";
        this.databaseObj.executeSql(q2, []).then(() => {
          // alert('Saving');
          this.flag = true;
        });
      }

      var q = "INSERT INTO mytable14 (Name,Address,Pan) VALUES (?,?,?)";
      this.databaseObj
        .executeSql(q, [this.first_name, this.address, this.pan])
        .then(() => {
          alert("Row Inserted!");
          this.getRows();
        })
        .catch((e) => {
          alert("error " + JSON.stringify(e));
        });
    }
  }

  insertRowBackground() {
    if (!this.first_name && !this.address && !this.pan) {
      // alert("Enter some details");
      return;
    } else if (this.flag) {
      // alert("Enter some details");
      return;
    } else {
      var q2 = "DELETE FROM mytable14 WHERE pid=1";
      this.databaseObj.executeSql(q2, []).then(() => {
        // alert('Saving when app is background');
      });

      var q = "INSERT INTO mytable14 (Name,Address,Pan) VALUES (?,?,?)";
      this.databaseObj
        .executeSql(q, [this.first_name, this.address, this.pan])
        .then(() => {
          alert("Previous Data Saved!");
          this.flag = false;
          this.getRows();
        })
        .catch((e) => {
          alert("error " + JSON.stringify(e));
        });
    }
  }
  // Retrieve rows from table
  getRows() {
    this.databaseObj
      .executeSql(
        `
    SELECT * FROM ${this.table_name}
    `,
        []
      )
      .then((res) => {
        this.row_data = [];
        if (res.rows.length > 0) {
          for (var i = 0; i < res.rows.length; i++) {
            console.log(res.rows.item(i));
            this.row_data.push(res.rows.item(i));
            this.first_name = this.row_data[0].Name;
            this.address = this.row_data[0].Address;
            this.pan = this.row_data[0].Pan;
          }
        }
      })
      .catch((e) => {
        alert("error " + JSON.stringify(e));
      });
  }

  // Delete single row
  deleteRow(item) {
    this.databaseObj
      .executeSql(
        `
      DELETE FROM ${this.table_name} WHERE pid = ${item.pid}
    `,
        []
      )
      .then((res) => {
        alert("Row Deleted!");
        this.getRows();
      })
      .catch((e) => {
        alert("error " + JSON.stringify(e));
      });
  }

  // Enable update mode and keep row data in a variable
  enableUpdate(item) {
    this.updateActive = true;
    this.to_update_item = item;
    this.first_name = item.Name;
  }

  // Update row with saved row id
  updateRow() {
    this.databaseObj
      .executeSql(
        `
        UPDATE ${this.table_name}
        SET Name = '${this.first_name}'
        WHERE pid = ${this.to_update_item.pid}
      `,
        []
      )
      .then(() => {
        alert("Row Updated!");
        this.updateActive = false;
        this.getRows();
      })
      .catch((e) => {
        alert("error " + JSON.stringify(e));
      });
  }

  submit() {
    alert("Data Submitted");
  }

  // addAddress() {
  //   this.addresses.push({
  //     id: this.addresses.length + 1,
  //     address: '',
  //     street: '',
  //     city: '',
  //     country: ''
  //   });
  // }

  // removeAddress(i: number) {
  //   this.addresses.splice(i, 1);
  // }

  // logValue() {
  //   console.log(this.addresses);
  // }
}
