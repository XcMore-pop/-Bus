function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index.html')
      .setTitle('ระบบจองที่นั่งรถบัส Real-time')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
      .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

// ดึงข้อมูลที่นั่งทั้งหมด
function getBookedSeats() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('BookingData');
  if (!sheet) return {};
  
  var data = sheet.getDataRange().getValues();
  var booked = {};
  
  for (var i = 1; i < data.length; i++) {
    var name = data[i][1];
    var role = data[i][2];
    var seat = data[i][3].toString().trim();
    if (seat) {
      booked[seat] = { name: name, role: role };
    }
  }
  return booked;
}

// บันทึกการจอง
function saveBooking(name, role, seat) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('BookingData');
  if (!sheet) return "ERROR: ไม่พบ Sheet ชื่อ 'BookingData' กรุณาตรวจสอบชื่อแท็บ";
  
  var data = sheet.getDataRange().getValues();
  var checkName = name.trim().toLowerCase();
  var checkSeat = seat.toString().trim();
  
  // 1. ตรวจสอบชื่อซ้ำ
  for (var i = 1; i < data.length; i++) {
    if (data[i][1].toString().trim().toLowerCase() === checkName) {
      return "ERROR: ชื่อนี้เคยทำการจองที่นั่งไปแล้ว ไม่สามารถจองซ้ำได้ครับ";
    }
  }
  
  // 2. ตรวจสอบที่นั่งซ้ำ
  for (var i = 1; i < data.length; i++) {
    if (data[i][3].toString().trim() === checkSeat) {
      return "ERROR: ที่นั่งหมายเลข " + seat + " มีคนจองตัดหน้าไปแล้วเมื่อสักครู่";
    }
  }
  
  // 3. บันทึกข้อมูล
  try {
    sheet.appendRow([new Date(), name.trim(), role, checkSeat]);
    return "SUCCESS";
  } catch(e) {
    return "ERROR: เกิดข้อผิดพลาดในการบันทึกข้อมูล " + e.toString();
  }
}
