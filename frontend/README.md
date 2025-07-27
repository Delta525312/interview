โครงสร้างโปรเจกต์ (Project Structure)
โปรเจกต์นี้จัดเรียงไฟล์และโฟลเดอร์ตามหลักการ "feature-sliced design" เพื่อให้ง่ายต่อการบำรุงรักษาและพัฒนาต่อยอด โดยแบ่งตามหน้าที่ความรับผิดชอบของแต่ละส่วนอย่างชัดเจน

โฟลเดอร์หลัก
/public: โฟลเดอร์สำหรับเก็บไฟล์สาธารณะ (Static Assets) ที่ไม่ต้องผ่านกระบวนการ Build เช่น รูปภาพ, เสียง, หรือฟอนต์

/public/solution1/: เก็บไฟล์สำหรับโจทย์ Solution 1 โดยเฉพาะ เช่น turtle.png และ walk.mp3

/src: โฟลเดอร์หลักที่เก็บ Source Code ทั้งหมดของแอปพลิเคชัน

โครงสร้างภายใน /src
📂 pages
โฟลเดอร์นี้เก็บ Component ที่ทำหน้าที่เป็นหน้าเว็บหลักแต่ละหน้า

/pages/Solution1/Solution1.tsx: Component หลักสำหรับหน้า "Solution 1" ทำหน้าที่เป็น Container ที่รวบรวม, จัดการ State, และควบคุม Logic ทั้งหมดของโจทย์ปัญหาเต่าเดินในเมทริกซ์

📂 components
เก็บ UI Components ที่สามารถนำกลับมาใช้ซ้ำได้ แบ่งเป็นสองส่วนหลัก:

/components/common/: เก็บ Components ทั่วไปที่ใช้ได้ในหลายๆ หน้า เช่น Layout, Breadcrumb

/components/solution1/: เก็บ Components ที่ถูกสร้างขึ้นเพื่อใช้ในหน้า Solution 1 โดยเฉพาะ

MatrixDisplay.tsx: Component สำหรับแสดงผลตารางเมทริกซ์และรูปเต่า

WalkInputs.tsx: Component สำหรับแสดงช่องกรอกข้อมูล (Input) เมื่อผู้ใช้เลือกรูปแบบการเดินที่ 1.2 และ 1.3

turtle-logic.ts: (ไฟล์สำคัญ) ไฟล์ที่เก็บ Logic การคำนวณเส้นทางการเดินของเต่าทั้ง 3 รูปแบบ (Zig-Zag, Spiral, Find Path) แยกออกจาก UI อย่างชัดเจน

turtle-styles.ts: ไฟล์สำหรับจัดการสไตล์ (CSS-in-JS) ของทุกส่วนประกอบในหน้า Solution 1

types.ts: ไฟล์สำหรับกำหนด TypeScript Types และ Interfaces ที่ใช้ร่วมกันใน Solution 1 เช่น Position, LogEntry

📂 contexts
สำหรับจัดการ State ส่วนกลาง (Global State) ด้วย React Context API

ThemeContext.tsx: จัดการข้อมูล Theme ของแอปพลิเคชัน (เช่น Dark/Light Mode)

SoundContext.tsx: จัดการสถานะการเปิด/ปิดเสียงส่วนกลาง (ถูกใช้ใน Solution 1 เพื่ออ่านค่า soundMuted)

📂 hooks
เก็บ Custom Hooks ที่สร้างขึ้นเองเพื่อนำ Logic ที่ใช้ซ้ำๆ มาใช้งานได้ง่ายขึ้น

📂 i18n & locales
i18n.ts: ไฟล์ตั้งค่าหลักสำหรับ Library i18next เพื่อจัดการการแปลภาษา (Internationalization)

/locales/: โฟลเดอร์ที่เก็บไฟล์คำแปลในรูปแบบ JSON โดยแยกตามภาษา (เช่น en, th)

/th/translation.json: ไฟล์เก็บข้อความทั้งหมดที่เป็นภาษาไทย 