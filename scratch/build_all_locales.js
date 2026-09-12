const fs = require('fs');
const path = require('path');

const locales = {
  as: {
    language: "ভাষা", hotelLemon: "হোটেল লেমন", adminDashboard: "এডমিন ড্যাশবৰ্ড", staffAttendance: "কৰ্মচাৰী উপস্থিতি ব্যৱস্থা", staffPortal: "কৰ্মচাৰী পোৰ্টেল",
    adminLogin: "🔑 এডমিন লগইন", staffLogin: "👤 কৰ্মচাৰী লগইন", username: "ব্যৱহাৰকাৰীৰ নাম", password: "পাছৱৰ্ড", employeeId: "কৰ্মচাৰী আইডি",
    enterAdminUsername: "এডমিন ব্যৱহাৰকাৰীৰ নাম দিয়ক", enterPassword: "পাছৱৰ্ড দিয়ক", enterEmployeeId: "যেনে EMP001", signInAdmin: "এডমিন হিচাপে প্ৰৱেশ কৰক →", signInStaff: "কৰ্মচাৰী হিচাপে প্ৰৱেশ কৰক →",
    dashboard: "ড্যাশবৰ্ড", dashboardOverview: "ড্যাশবৰ্ড মূল অৱলোকন", attendance: "উপস্থিতি", staffManagement: "কৰ্মচাৰী পৰিচালনা", settings: "ছেটিংছ", logout: "লগআউট",
    totalStaff: "মুঠ কৰ্মচাৰী", presentToday: "আজি উপস্থিত", absent: "অনুপস্থিত", lateArrivals: "পলমকৈ অহা", todaysActivity: "🕐 আজিৰ কাৰ্যকলাপ", noAttendanceRecords: "আজিৰ কোনো উপস্থিতি ৰেকৰ্ড নাই",
    searchByNameOrId: "🔍 নাম বা আইডিৰে বিচাৰক...", allDepartments: "সকলো বিভাগ", exportCsv: "📥 CSV এক্সপোৰ্ট", noRecordsFound: "📭 কোনো ৰেকৰ্ড পোৱা নগ'ল",
    activeStaffMembers: "সক্ৰিয় কৰ্মচাৰীসকল", addStaff: "➕ কৰ্মচাৰী যোগ কৰক", hotelInformation: "🏨 হোটেল তথ্য", hotelName: "হোটেলৰ নাম", shiftPolicy: "⏰ সময় নিয়ম আৰু নীতি",
    defaultShiftStart: "ডিফল্ট আৰম্ভণি সময়", defaultShiftEnd: "ডিফল্ট শেষ সময়", gracePeriod: "অনুগ্ৰহ সময় (মিনিট)", savePolicy: "💾 নীতি সংৰক্ষণ কৰক", individualShiftTimings: "👥 ব্যক্তিগত কৰ্মচাৰীৰ সময়", resetData: "⚠️ সকলো তথ্য ৰিচেট কৰক",
    goodMorning: "সুপ্ৰভাত!", goodAfternoon: "শুভ অপৰাহ্ন!", goodEvening: "শুভ সন্ধ্যা!", checkInPhoto: "📸 লাইভ ফটোৰে চেক ইন কৰক", checkOutPhoto: "📤 লাইভ ফটোৰে চেক আউট কৰক", notCheckedIn: "চেক ইন কৰা হোৱা নাই", tapToCheckIn: "লাইভ ফটোৰে চেক ইন কৰিবলৈ তলৰ বুটামত টিপক", attendanceHistory: "📅 মোৰ উপস্থিতি ইতিহাস", noHistory: "📭 কোনো উপস্থিতি ইতিহাস নাই",
    invalidAdmin: "অসিদ্ধ এডমিন তথ্য", invalidStaff: "অসিদ্ধ কৰ্মচাৰী আইডি বা পাছৱৰ্ড", welcomeBack: "পুনৰ স্বাগতম, {name}!", welcomeStaff: "স্বাগতম, {name}!"
  },
  bn: {
    language: "ভাষা", hotelLemon: "হোটেল লেমন", adminDashboard: "অ্যাডমিন ড্যাশবোর্ড", staffAttendance: "কর্মী উপস্থিতি সিস্টেম", staffPortal: "কর্মী পোর্টাল",
    adminLogin: "🔑 অ্যাডমিন লগইন", staffLogin: "👤 কর্মী লগইন", username: "ব্যবহারকারীর নাম", password: "পাসওয়ার্ড", employeeId: "কর্মী আইডি",
    enterAdminUsername: "অ্যাডমিন ইউজারনেম দিন", enterPassword: "পাসওয়ার্ড দিন", enterEmployeeId: "যেমন EMP001", signInAdmin: "অ্যাডমিন হিসেবে সাইন ইন করুন →", signInStaff: "কর্মী হিসেবে সাইন ইন করুন →",
    dashboard: "ড্যাশবোর্ড", dashboardOverview: "ড্যাশবোর্ড ওভারভিউ", attendance: "উপস্থিতি", staffManagement: "কর্মী ব্যবস্থাপনা", settings: "সেটিংস", logout: "লগআউট",
    totalStaff: "মোট কর্মী", presentToday: "আজ উপস্থিত", absent: "অনুপস্থিত", lateArrivals: "দেরিতে আসা কর্মী", todaysActivity: "🕐 আজকের কার্যক্রম", noAttendanceRecords: "আজকের কোনো উপস্থিতি রেকর্ড নেই",
    searchByNameOrId: "🔍 নাম বা আইডি দিয়ে খুঁজুন...", allDepartments: "সকল বিভাগ", exportCsv: "📥 CSV এক্সপোর্ট", noRecordsFound: "📭 কোনো রেকর্ড পাওয়া যায়নি",
    activeStaffMembers: "সক্রিয় কর্মী সদস্য", addStaff: "➕ কর্মী যুক্ত করুন", hotelInformation: "🏨 হোটেল তথ্য", hotelName: "হোটেলের নাম", shiftPolicy: "⏰ শিফটের নিয়ম ও সময়সূচী",
    defaultShiftStart: "ডিফল্ট শিফট শুরু", defaultShiftEnd: "ডিফল্ট শিফট শেষ", gracePeriod: "গ্রেস সময় (মিনিট)", savePolicy: "💾 পলিসি সেটিংস সংরক্ষণ করুন", individualShiftTimings: "👥 ব্যক্তিগত কর্মী শিফট সময়", resetData: "⚠️ সব ডেটা রিসেট করুন",
    goodMorning: "শুভ সকাল!", goodAfternoon: "শুভ অপরাহ্ন!", goodEvening: "শুভ সন্ধ্যা!", checkInPhoto: "📸 লাইভ ছবি সহ চেক ইন করুন", checkOutPhoto: "📤 লাইভ ছবি সহ চেক আউট করুন", notCheckedIn: "চেক ইন করা হয়নি", tapToCheckIn: "লাইভ ছবি সহ চেক ইন করতে নিচের বোতামে ট্যাপ করুন", attendanceHistory: "📅 আমার উপস্থিতির ইতিহাস", noHistory: "📭 কোনো উপস্থিতির ইতিহাস নেই",
    invalidAdmin: "অবৈধ অ্যাডমিন তথ্য", invalidStaff: "অবৈধ কর্মী আইডি বা পাসওয়ার্ড", welcomeBack: "স্বাগতম, {name}!", welcomeStaff: "স্বাগতম, {name}!"
  },
  brx: {
    language: "राव", hotelLemon: "होटेल लेमन", adminDashboard: "एडमिन देसबोर्ड", staffAttendance: "हाजिरि बेवस्था", staffPortal: "मावथि पोर्टल",
    adminLogin: "🔑 एडमिन लगइन", staffLogin: "👤 मावथि लगइन", username: "युजारमुं", password: "पासवर्ड", employeeId: "मावथि आइदि",
    enterAdminUsername: "एडमिन युजारमुं लिर", enterPassword: "पासवर्ड लिर", enterEmployeeId: "जेरै EMP001", signInAdmin: "एडमिन महरै हाब →", signInStaff: "मावथि महरै हाब →",
    dashboard: "देसबोर्ड", dashboardOverview: "देसबोर्ड नायफिननाय", attendance: "हाजिरि", staffManagement: "मावथि सामलायनाय", settings: "सेटिंफोर", logout: "अंखारनाय",
    totalStaff: "गासै मावथि", presentToday: "दिनै हाजिर", absent: "गेयाै", lateArrivals: "उनाव फैनाय", todaysActivity: "🕐 दिनैनि हाबाफारि", noAttendanceRecords: "दिनैनि हाजिरि रेकर्ड गैया",
    searchByNameOrId: "🔍 मुं एबा आइदिजों नागिर...", allDepartments: "गासै बिफानफोर", exportCsv: "📥 CSV दिहुननाय", noRecordsFound: "📭 जेबो रेकर्ड मोनाखै",
    activeStaffMembers: "मावथि सोद्रोमाफोर", addStaff: "➕ मावथि सोदेर", hotelInformation: "🏨 होटेल मिथिसिनाय", hotelName: "होटेलनि मुं", shiftPolicy: "⏰ समनि नियमफोर",
    defaultShiftStart: "जानाय सम", defaultShiftEnd: "जोबनाय सम", gracePeriod: "रेहाय सम (मिनिट)", savePolicy: "💾 नियमफोर साबसिन", individualShiftTimings: "👥 मावथिनि समफोर", resetData: "⚠️ गासै देथा रीसेट खालाम",
    goodMorning: "मोजां फुं!", goodAfternoon: "मोजां बेगेनि!", goodEvening: "मोजां बेलासिनि!", checkInPhoto: "📸 लाइभ फोटोजों चेक इन खालाम", checkOutPhoto: "📤 लाइभ फोटोजों चेक आउट खालाम", notCheckedIn: "चेक इन खालामाखै", tapToCheckIn: "गाहायनि बटनो थुना चेक इन खालाम", attendanceHistory: "📅 आंनि हाजिरि जारिमिन", noHistory: "📭 जेबो हाजिरि जारिमिन गैया",
    invalidAdmin: "गोरोन्थि एडमिन बाथ्रा", invalidStaff: "गोरोन्थि आइदि एबा पासवर्ड", welcomeBack: "बरायबाय, {name}!", welcomeStaff: "बरायबाय, {name}!"
  },
  doi: {
    language: "भाषा", hotelLemon: "होटल लेमन", adminDashboard: "एडमिन डैशबोर्ड", staffAttendance: "कर्मचारी हाजिरी प्रणाली", staffPortal: "कर्मचारी पोर्टल",
    adminLogin: "🔑 एडमिन लॉगिन", staffLogin: "👤 कर्मचारी लॉगिन", username: "यूजरनेम", password: "पासवर्ड", employeeId: "कर्मचारी आईडी",
    enterAdminUsername: "एडमिन यूजरनेम दर्ज करो", enterPassword: "पासवर्ड दर्ज करो", enterEmployeeId: "जैसे EMP001", signInAdmin: "एडमिन रूपे लॉगिन करो →", signInStaff: "कर्मचारी रूपे लॉगिन करो →",
    dashboard: "डैशबोर्ड", dashboardOverview: "डैशबोर्ड सिंहावलोकन", attendance: "हाजिरी", staffManagement: "कर्मचारी प्रबंधन", settings: "सेटिंग्स", logout: "लॉगआउट",
    totalStaff: "कुल कर्मचारी", presentToday: "अज्ज हाजिर", absent: "गैरहाजिर", lateArrivals: "चिरै आने आले", todaysActivity: "🕐 अज्जै दी गतिविधि", noAttendanceRecords: "अज्जै दा कोई हाजिरी रिकार्ड नेईं",
    searchByNameOrId: "🔍 नां जा आईडी थमां लब्भो...", allDepartments: "सब विभाग", exportCsv: "📥 CSV निर्यात करो", noRecordsFound: "📭 कोई रिकार्ड नेईं मिल्या",
    activeStaffMembers: "सक्रिय कर्मचारी", addStaff: "➕ कर्मचारी जोड़ो", hotelInformation: "🏨 होटल जानकारी", hotelName: "होटल दा नां", shiftPolicy: "⏰ शिफ्ट समां नियम",
    defaultShiftStart: "शुरू दा समां", defaultShiftEnd: "खतम दा समां", gracePeriod: "छूट समां (मिनट)", savePolicy: "💾 नियम सुरक्षित करो", individualShiftTimings: "👥 व्यक्तिगत शिफ्ट समां", resetData: "⚠️ सब डेटा रीसेट करो",
    goodMorning: "शुभ सवेर!", goodAfternoon: "शुभ दुपेह्र!", goodEvening: "शुभ संझा!", checkInPhoto: "📸 लाइव फोटो कन्ने चेक इन करो", checkOutPhoto: "📤 लाइव फोटो कन्ने चेक आउट करो", notCheckedIn: "चेक इन नेईं कीता", tapToCheckIn: "हेठ दित्ते बटन पर टैप करो", attendanceHistory: "📅 मेरी हाजिरी दा इतिहास", noHistory: "📭 कोई हाजिरी इतिहास नेईं",
    invalidAdmin: "गलत एडमिन जानकारी", invalidStaff: "गलत आईडी जा पासवर्ड", welcomeBack: "स्वागत है, {name}!", welcomeStaff: "स्वागत है, {name}!"
  },
  gu: {
    language: "ભાષા", hotelLemon: "હોટેલ લેમન", adminDashboard: "એડમિન ડેશબોર્ડ", staffAttendance: "સ્ટાફ હાજરી સિસ્ટમ", staffPortal: "સ્ટાફ પોર્ટલ",
    adminLogin: "🔑 એડમિન લોગિન", staffLogin: "👤 સ્ટાફ લોગિન", username: "વપરાશકર્તાનામ", password: "પાસવર્ડ", employeeId: "કર્મચારી આઈડી",
    enterAdminUsername: "એડમિન યુઝરનામ દાખલ કરો", enterPassword: "પાસવર્ડ દાખલ કરો", enterEmployeeId: "દા.ત. EMP001", signInAdmin: "એડમિન તરીકે લોગિન કરો →", signInStaff: "સ્ટાફ તરીકે લોગિન કરો →",
    dashboard: "ડેશબોર્ડ", dashboardOverview: "ડેશબોર્ડ ઝાંખી", attendance: "હાજરી", staffManagement: "સ્ટાફ મેનેજમેન્ટ", settings: "સેટિંગ્સ", logout: "લોગઆઉટ",
    totalStaff: "કુલ સ્ટાફ", presentToday: "આજે હાજર", absent: "ગેરહાજર", lateArrivals: "મોડા આવેલા", todaysActivity: "🕐 આજની પ્રવૃત્તિ", noAttendanceRecords: "આજ માટે કોઈ હાજરી રેકોર્ડ નથી",
    searchByNameOrId: "🔍 નામ અથવા આઈડી દ્વારા શોધો...", allDepartments: "બધા વિભાગો", exportCsv: "📥 CSV નિકાસ કરો", noRecordsFound: "📭 કોઈ રેકોર્ડ મળ્યો નથી",
    activeStaffMembers: "સક્રિય સ્ટાફ સભ્યો", addStaff: "➕ સ્ટાફ ઉમેરો", hotelInformation: "🏨 હોટેલ માહિતી", hotelName: "હોટેલનું નામ", shiftPolicy: "⏰ શિફ્ટ સમય નીતિ અને નિયમો",
    defaultShiftStart: "ડિફોલ્ટ શિફ્ટ શરૂઆત સમય", defaultShiftEnd: "ડિફોલ્ટ શિફ્ટ સમાપ્તિ સમય", gracePeriod: "ગ્રેસ પીરિયડ (મિનિટ)", savePolicy: "💾 નીતિ સેટિંગ્સ સાચવો", individualShiftTimings: "👥 વ્યક્તિગત સ્ટાફ શિફ્ટ સમય", resetData: "⚠️ તમામ ડેટા રીસેટ કરો",
    goodMorning: "સુપ્રભાત!", goodAfternoon: "શુભ બપોર!", goodEvening: "શુભ સંધ્યા!", checkInPhoto: "📸 લાઈવ ફોટો સાથે ચેક ઈન કરો", checkOutPhoto: "📤 લાઈવ ફોટો સાથે ચેક આઉટ કરો", notCheckedIn: "ચેક ઈન થયેલ નથી", tapToCheckIn: "લાઈવ ફોટો સાથે ચેક ઈન કરવા માટે નીચેના બટન પર ટેપ કરો", attendanceHistory: "📅 મારી હાજરીનો ઇતિહાસ", noHistory: "📭 હજી સુધી કોઈ હાજરી ઇતિહાસ નથી",
    invalidAdmin: "અમાન્ય એડમિન વિગતો", invalidStaff: "અમાન્ય કર્મચારી આઈડી અથવા પાસવર્ડ", welcomeBack: "પાછા સ્વાગત છે, {name}!", welcomeStaff: "સ્વાગત છે, {name}!"
  },
  kn: {
    language: "ಭಾಷೆ", hotelLemon: "ಹೋಟೆಲ್ ಲೆಮನ್", adminDashboard: "ಅಡ್ಮಿನ್ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್", staffAttendance: "ಸಿಬ್ಬಂದಿ ಹಾಜರಾತಿ ವ್ಯವಸ್ಥೆ", staffPortal: "ಸಿಬ್ಬಂದಿ ಪೋರ್ಟಲ್",
    adminLogin: "🔑 ಅಡ್ಮಿನ್ ಲಾಗಿನ್", staffLogin: "👤 ಸಿಬ್ಬಂದಿ ಲಾಗಿನ್", username: "ಬಳಕೆದಾರ ಹೆಸರು", password: "ಪಾಸ್‌ವರ್ಡ್", employeeId: "ಉದ್ಯೋಗಿ ಐಡಿ",
    enterAdminUsername: "ಅಡ್ಮಿನ್ ಬಳಕೆದಾರ ಹೆಸರು ನಮೂದಿಸಿ", enterPassword: "ಪಾಸ್‌ವರ್ಡ್ ನಮೂದಿಸಿ", enterEmployeeId: "ಉದಾ: EMP001", signInAdmin: "ಅಡ್ಮಿನ್ ಆಗಿ ಸೈನ್ ಇನ್ ಮಾಡಿ →", signInStaff: "ಸಿಬ್ಬಂದಿಯಾಗಿ ಸೈನ್ ಇನ್ ಮಾಡಿ →",
    dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್", dashboardOverview: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ಅವಲೋಕನ", attendance: "ಹಾಜರಾತಿ", staffManagement: "ಸಿಬ್ಬಂದಿ ನಿರ್ವಹಣೆ", settings: "ಸೆಟ್ಟಿಂಗ್‌ಗಳು", logout: "ಲಾಗ್‌ಔಟ್",
    totalStaff: "ಒಟ್ಟು ಸಿಬ್ಬಂದಿ", presentToday: "ಇಂದು ಹಾಜರಿದ್ದವರು", absent: "ಗೈರುಹಾಜರಾದವರು", lateArrivals: "ತಡವಾಗಿ ಬಂದವರು", todaysActivity: "🕐 ಇಂದಿನ ಚಟುವಟಿಕೆ", noAttendanceRecords: "ಇಂದು ಯಾವುದೇ ಹಾಜರಾತಿ ದಾಖಲೆಗಳಿಲ್ಲ",
    searchByNameOrId: "🔍 ಹೆಸರು ಅಥವಾ ಐಡಿ ಮೂಲಕ ಹುಡುಕಿ...", allDepartments: "ಎಲ್ಲಾ ಇಲಾಖೆಗಳು", exportCsv: "📥 CSV ರಫ್ತು ಮಾಡಿ", noRecordsFound: "📭 ಯಾವುದೇ ದಾಖಲೆಗಳು ಕಂಡುಬಂದಿಲ್ಲ",
    activeStaffMembers: "ಸಕ್ರಿಯ ಸಿಬ್ಬಂದಿ ಸದಸ್ಯರು", addStaff: "➕ ಸಿಬ್ಬಂದಿ ಸೇರಿಸಿ", hotelInformation: "🏨 ಹೋಟೆಲ್ ಮಾಹಿತಿ", hotelName: "ಹೋಟೆಲ್ ಹೆಸರು", shiftPolicy: "⏰ ಶಿಫ್ಟ್ ಸಮಯ ನೀತಿ ಮತ್ತು ನಿಯಮಗಳು",
    defaultShiftStart: "ಡೀಫಾಲ್ಟ್ ಶಿಫ್ಟ್ ಪ್ರಾರಂಭ ಸಮಯ", defaultShiftEnd: "ಡೀಫಾಲ್ಟ್ ಶಿಫ್ಟ್ ಮುಕ್ತಾಯ ಸಮಯ", gracePeriod: "ಸಡಿಲಿಕೆ ಸಮಯ (ನಿಮಿಷಗಳು)", savePolicy: "💾 ನೀತಿ ಸೆಟ್ಟಿಂಗ್‌ಗಳನ್ನು ಉಳಿಸಿ", individualShiftTimings: "👥 ವೈಯಕ್ತಿಕ ಸಿಬ್ಬಂದಿ ಶಿಫ್ಟ್ ಸಮಯಗಳು", resetData: "⚠️ ಎಲ್ಲಾ ಡೇಟಾ ಮರುಹೊಂದಿಸಿ",
    goodMorning: "ಶುಭೋದಯ!", goodAfternoon: "ಶುಭ ಮಧ್ಯಾಹ್ನ!", goodEvening: "ಶುಭ ಸಂಜೆ!", checkInPhoto: "📸 ಲೈವ್ ಫೋಟೋದೊಂದಿಗೆ ಚೆಕ್ ಇನ್ ಮಾಡಿ", checkOutPhoto: "📤 ಲೈವ್ ಫೋಟೋದೊಂದಿಗೆ ಚೆಕ್ ಔಟ್ ಮಾಡಿ", notCheckedIn: "ಚೆಕ್ ಇನ್ ಆಗಿಲ್ಲ", tapToCheckIn: "ಲೈವ್ ಫೋಟೋದೊಂದಿಗೆ ಚೆಕ್ ಇನ್ ಮಾಡಲು ಕೆಳಗಿನ ಬಟನ್ ಒತ್ತಿ", attendanceHistory: "📅 ನನ್ನ ಹಾಜರಾತಿ ಇತಿಹಾಸ", noHistory: "📭 ಇನ್ನೂ ಯಾವುದೇ ಹಾಜರಾತಿ ಇತಿಹಾಸವಿಲ್ಲ",
    invalidAdmin: "ಅಮಾನ್ಯ ಅಡ್ಮಿನ್ ವಿವರಗಳು", invalidStaff: "ಅಮಾನ್ಯ ಉದ್ಯೋಗಿ ಐಡಿ ಅಥವಾ ಪಾಸ್‌ವರ್ಡ್", welcomeBack: "ಮತ್ತೆ ಸುಸ್ವಾಗತ, {name}!", welcomeStaff: "ಸುಸ್ವಾಗತ, {name}!"
  },
  ks: {
    language: "ਜ਼ਬਾਨ", hotelLemon: "होटल लेमन", adminDashboard: "एडमिन डैशबोर्ड", staffAttendance: "अमले हाज़री निज़ाम", staffPortal: "अमला पोर्टल",
    adminLogin: "🔑 एडमिन लॉगिन", staffLogin: "👤 अमला लॉगिन", username: "युजरनाव", password: "पासवर्ड", employeeId: "मुलाज़िम आईडी",
    enterAdminUsername: "एडमिन युजरनाव दर्ज करिव", enterPassword: "पासवर्ड दर्ज करिव", enterEmployeeId: "मिसाल EMP001", signInAdmin: "एडमिन पैठ लॉगिन करिव →", signInStaff: "अमले पैठ लॉगिन करिव →",
    dashboard: "डैशबोर्ड", dashboardOverview: "डैशबोर्ड ख़ुलासा", attendance: "हाज़री", staffManagement: "अमले काम", settings: "सेटिंग्स", logout: "लॉगआउट",
    totalStaff: "कुल अमला", presentToday: "अज़ हाज़िर", absent: "ग़ैरहाज़िर", lateArrivals: "लेट आमुत", todaysActivity: "🕐 अज़ुक काम", noAttendanceRecords: "अज़ुक कांह हाज़री रिकार्ड छुने",
    searchByNameOrId: "🔍 नाव या आईडी सान छांडिव...", allDepartments: "सोरुय महकमे", exportCsv: "📥 CSV न्येबर कडिव", noRecordsFound: "📭 कांह रिकार्ड न्येब्रोव ने",
    activeStaffMembers: "सरगर्म अमला", addStaff: "➕ अमला शामिल करिव", hotelInformation: "🏨 होटल जानकारी", hotelName: "होटलुक नाव", shiftPolicy: "⏰ कामुक वक़्त नियम",
    defaultShiftStart: "शुरू गछुक वक़्त", defaultShiftEnd: "मुकpath वक़्त", gracePeriod: "छूट वक़्त (मिनट)", savePolicy: "💾 नियम महफूज़ करिव", individualShiftTimings: "👥 अमले वक़्त", resetData: "⚠️ सोरुय डेटा रीसेट करिव",
    goodMorning: "सुबह बख़ैर!", goodAfternoon: "नमस्कार!", goodEvening: "शाम बख़ैर!", checkInPhoto: "📸 लाइव फोटो सान चेक इन करिव", checkOutPhoto: "📤 लाइव फोटो सान चेक आउट करिव", notCheckedIn: "चेक इन कोर्मुत छुने", tapToCheckIn: "चेक इन करने ख़ातिर बटनेस पैठ क्लिक करिव", attendanceHistory: "📅 म्योन हाज़री रिकॉर्ड", noHistory: "📭 कांह हाज़री रिकॉर्ड छुने",
    invalidAdmin: "ग़लत एडमिन जानकारी", invalidStaff: "ग़लत आईडी या पासवर्ड", welcomeBack: "ख़ुश आमदीद, {name}!", welcomeStaff: "ख़ुश आमदीद, {name}!"
  },
  kok: {
    language: "भाशा", hotelLemon: "हॉटेल लेमन", adminDashboard: "ॲडमिन डॅशबोर्ड", staffAttendance: "कर्मचारी हाजेरी वेवस्था", staffPortal: "कर्मचारी पोर्टल",
    adminLogin: "🔑 ॲडमिन लॉगिन", staffLogin: "👤 कर्मचारी लॉगिन", username: "वापरपी नाव", password: "पासवर्ड", employeeId: "कर्मचारी आयडी",
    enterAdminUsername: "ॲडमिन वापरपी नाव घाला", enterPassword: "पासवर्ड घाला", enterEmployeeId: "देखीक EMP001", signInAdmin: "ॲडमिन म्हूण लॉगिन करा →", signInStaff: "कर्मचारी म्हूण लॉगिन करा →",
    dashboard: "डॅशबोर्ड", dashboardOverview: "डॅशबोर्ड सोद", attendance: "हाजेरी", staffManagement: "कर्मचारी व्यवस्थापन", settings: "सेटिंग्ज", logout: "लॉगआउट",
    totalStaff: "कुल कर्मचारी", presentToday: "आज हाजर", absent: "गैरहाजर", lateArrivals: "उशीरां आयिले", todaysActivity: "🕐 आजचो वावर", noAttendanceRecords: "आजची हाजेरी नोंद ना",
    searchByNameOrId: "🔍 नाव वा आयडीन शोधा...", allDepartments: "सगळे विभाग", exportCsv: "📥 CSV भायर काढा", noRecordsFound: "📭 कसलीच नोंद मेळूंक ना",
    activeStaffMembers: "सक्रिय कर्मचारी", addStaff: "➕ कर्मचारी जोडा", hotelInformation: "🏨 हॉटेल म्हाहिती", hotelName: "हॉटेलाचे नाव", shiftPolicy: "⏰ शिफ्ट वेळ नियम",
    defaultShiftStart: "शुरू जावपाची वेळ", defaultShiftEnd: "सोपपाची वेळ", gracePeriod: "सवलतीची वेळ (मिनिटां)", savePolicy: "💾 नियम सांबाळा", individualShiftTimings: "👥 वैयक्तिक शिफ्ट वेळ", resetData: "⚠️ सगळो डेटा रीसेट करा",
    goodMorning: "देव बरे सोबीत सकाळ दी!", goodAfternoon: "शुभ दनपार!", goodEvening: "शुभ सांज!", checkInPhoto: "📸 लाईव्ह फोटो सयत चेक इन करा", checkOutPhoto: "📤 लाईव्ह फोटो सयत चेक आउट करा", notCheckedIn: "अजून चेक इन करूंक ना", tapToCheckIn: "चेक इन करपाक सकयल्या बटणावर क्लिक करा", attendanceHistory: "📅 म्हजी हाजेरी नोंद", noHistory: "📭 कसलीच हाजेरी नोंद ना",
    invalidAdmin: "चुकीची ॲडमिन माहिती", invalidStaff: "चुकीची आयडी वा पासवर्ड", welcomeBack: "येयात, {name}!", welcomeStaff: "येयात, {name}!"
  },
  mai: {
    language: "भाषा", hotelLemon: "होटल लेमन", adminDashboard: "एडमिन डैशबोर्ड", staffAttendance: "कर्मचारी उपस्थिति प्रणाली", staffPortal: "कर्मचारी पोर्टल",
    adminLogin: "🔑 एडमिन लॉगिन", staffLogin: "👤 कर्मचारी लॉगिन", username: "उपयोगकर्ता नाम", password: "पासवर्ड", employeeId: "कर्मचारी आईडी",
    enterAdminUsername: "एडमिन प्रयोक्ता नाम भरू", enterPassword: "पासवर्ड भरू", enterEmployeeId: "जैना EMP001", signInAdmin: "एडमिन रूपे लॉगिन करू →", signInStaff: "कर्मचारी रूपे लॉगिन करू →",
    dashboard: "डैशबोर्ड", dashboardOverview: "डैशबोर्ड अवलोकन", attendance: "उपस्थिति", staffManagement: "कर्मचारी प्रबंधन", settings: "सेटिंग्स", logout: "लॉगआउट",
    totalStaff: "कुल कर्मचारी", presentToday: "अहाँ उपस्थित", absent: "अनुपस्थित", lateArrivals: "देरी सँ आयल", todaysActivity: "🕐 आजुक गतिविधि", noAttendanceRecords: "आजुक कोनौ उपस्थिति रिकॉर्ड नहि अछि",
    searchByNameOrId: "🔍 नाम या आईडी सँ खोजू...", allDepartments: "सबहि विभाग", exportCsv: "📥 CSV निर्यात करू", noRecordsFound: "📭 कोनौ रिकॉर्ड नहि भेटल",
    activeStaffMembers: "सक्रिय कर्मचारी", addStaff: "➕ कर्मचारी जोड़ू", hotelInformation: "🏨 होटल जानकारी", hotelName: "होटलक नाम", shiftPolicy: "⏰ शिफ्ट समय नियम",
    defaultShiftStart: "शुरू समय", defaultShiftEnd: "समाप्त समय", gracePeriod: "छूट समय (मिनट)", savePolicy: "💾 नियम सुरक्षित करू", individualShiftTimings: "👥 व्यक्तिगत शिफ्ट समय", resetData: "⚠️ सब डाटा रीसेट करू",
    goodMorning: "सुप्रभात!", goodAfternoon: "शुभ दोपहर!", goodEvening: "शुभ संध्या!", checkInPhoto: "📸 लाइव फोटो सँ चेक इन करू", checkOutPhoto: "📤 लाइव फोटो सँ चेक आउट करू", notCheckedIn: "अखुनु चेक इन नहि भेल अछि", tapToCheckIn: "चेक इन लेल नीचाँ देल बटन दबाऊ", attendanceHistory: "📅 हमर उपस्थिति इतिहास", noHistory: "📭 कोनौ उपस्थिति इतिहास नहि अछि",
    invalidAdmin: "गलत एडमिन जानकारी", invalidStaff: "गलत आईडी या पासवर्ड", welcomeBack: "अहाँक स्वागत अछि, {name}!", welcomeStaff: "अहाँक स्वागत अछि, {name}!"
  },
  ml: {
    language: "ഭാഷ", hotelLemon: "ഹോട്ടൽ ലെമൺ", adminDashboard: "അഡ്മിൻ ഡാഷ്‌ബോർഡ്", staffAttendance: "ജീവനക്കാരുടെ ഹാജർ സിസ്റ്റം", staffPortal: "സ്റ്റാഫ് പോർട്ടൽ",
    adminLogin: "🔑 അഡ്മിൻ ലോഗിൻ", staffLogin: "👤 സ്റ്റാഫ് ലോഗിൻ", username: "ഉപയോക്തൃനാമം", password: "പാസ്‌വേഡ്", employeeId: "എംപ്ലോയി ഐഡി",
    enterAdminUsername: "അഡ്മിൻ ഉപയോക്തൃനാമം നൽകുക", enterPassword: "പാസ്‌വേഡ് നൽകുക", enterEmployeeId: "ഉദാ: EMP001", signInAdmin: "അഡ്മിൻ ആയി പ്രവേശിക്കുക →", signInStaff: "സ്റ്റാഫ് ആയി പ്രവേശിക്കുക →",
    dashboard: "ഡാഷ്‌ബോർഡ്", dashboardOverview: "ഡാഷ്‌ബോർഡ് അവലോകനം", attendance: "ഹാജർ നില", staffManagement: "സ്റ്റാഫ് മാനേജ്മെന്റ്", settings: "സെറ്റിംഗ്സ്", logout: "ലോഗ് ഔട്ട്",
    totalStaff: "ആകെ ജീവനക്കാർ", presentToday: "ഇന്ന് വന്നവർ", absent: "വരാത്തവർ", lateArrivals: "വൈകി വന്നവർ", todaysActivity: "🕐 ഇന്നത്തെ വിവരങ്ങൾ", noAttendanceRecords: "ഇന്ന് ഇതുവരെ ഹാജർ റെക്കോർഡുകളൊന്നുമില്ല",
    searchByNameOrId: "🔍 പേര് അല്ലെങ്കിൽ ഐഡി ഉപയോഗിച്ച് തിരയുക...", allDepartments: "എല്ലാ വകുപ്പുകളും", exportCsv: "📥 CSV എക്സ്പോർട്ട്", noRecordsFound: "📭 റെക്കോർഡുകളൊന്നും കണ്ടെത്തിയില്ല",
    activeStaffMembers: "നിലവിലുള്ള ജീവനക്കാർ", addStaff: "➕ ജീവനക്കാരെ ചേർക്കുക", hotelInformation: "🏨 ഹോട്ടൽ വിവരങ്ങൾ", hotelName: "ഹോട്ടലിന്റെ പേര്", shiftPolicy: "⏰ ഷിഫ്റ്റ് സമയ നയങ്ങളും നിയമങ്ങളും",
    defaultShiftStart: "സാധാരണ ഷിഫ്റ്റ് തുടക്കം", defaultShiftEnd: "സാധാരണ ഷിഫ്റ്റ് അവസാനം", gracePeriod: "ഇളവ് സമയം (മിനിറ്റ്)", savePolicy: "💾 നയങ്ങൾ സേവ് ചെയ്യുക", individualShiftTimings: "👥 വ്യക്തിഗത ഷിഫ്റ്റ് സമയം", resetData: "⚠️ ഡാറ്റ റീസെറ്റ് ചെയ്യുക",
    goodMorning: "സുപ്രഭാതം!", goodAfternoon: "ശുഭ ഉച്ചസമയം!", goodEvening: "ശുഭ സായാഹ്നം!", checkInPhoto: "📸 ലൈവ് ഫോട്ടോ ഉപയോഗിച്ച് ചെക്ക് ഇൻ ചെയ്യുക", checkOutPhoto: "📤 ലൈവ് ഫോട്ടോ ഉപയോഗിച്ച് ചെക്ക് ഔട്ട് ചെയ്യുക", notCheckedIn: "ഇതുവരെ ചെക്ക് ഇൻ ചെയ്തിട്ടില്ല", tapToCheckIn: "ലൈവ് ഫോട്ടോ ഉപയോഗിച്ച് ചെക്ക് ഇൻ ചെയ്യാൻ താഴെയുള്ള ബട്ടൺ അമർത്തുക", attendanceHistory: "📅 എൻ്റെ ഹാജർ ചരിത്രം", noHistory: "📭 ഹാജർ ചരിത്രമൊന്നും ലഭ്യമല്ല",
    invalidAdmin: "തെറ്റായ അഡ്മിൻ വിവരങ്ങൾ", invalidStaff: "തെറ്റായ ഐഡിയോ പാസ്‌വേഡോ", welcomeBack: "വീണ്ടും സ്വാഗതം, {name}!", welcomeStaff: "സ്വാഗതം, {name}!"
  },
  mni: {
    language: "ലോൺ", hotelLemon: "ഹോട്ടൽ ലെമൺ", adminDashboard: "এডমিন দেশবোর্ড", staffAttendance: "সিংলোই লেপপা সিস্তেম", staffPortal: "সিংলোই পোর্তাল",
    adminLogin: "🔑 এডমিন চংবা", staffLogin: "👤 সিংলোই চংবা", username: "শিজিন্নরিবা মিং", password: "পাসৱার্দ", employeeId: "সিংলোই আইডি",
    enterAdminUsername: "এডমিন মিং ইবিয়ু", enterPassword: "পাসৱার্দ ইবিয়ু", enterEmployeeId: "হায়বদি EMP001", signInAdmin: "এডমিন ওইনা চংবিয়ু →", signInStaff: "সিংলোই ওইনা চংবিয়ু →",
    dashboard: "দেশবোর্ড", dashboardOverview: "দেশবোর্ড য়েংশিনবা", attendance: "লেপপা", staffManagement: "সিংলোই শিনবা-লাংবা", settings: "সেটিংস", logout: "থোকপা",
    totalStaff: "পুম্বাগী সিংলোই", presentToday: "ঙসি লেপখিবশিং", absent: "লেপখিদবশিং", lateArrivals: "থেংনা লাকপশিং", todaysActivity: "🕐 ঙসিগী থবকশিং", noAttendanceRecords: "ঙসিগী লেপপগী রে কোর্দ লৈত্রি",
    searchByNameOrId: "🔍 মিং নত্রগা আইডি থিবিয়ু...", allDepartments: "পুম্নমক বিভাগশিং", exportCsv: "📥 CSV পুথোকপা", noRecordsFound: "📭 রে কোর্দ ফংদ্রে",
    activeStaffMembers: "থবক তৌরিবা সিংলোই", addStaff: "➕ সিংলোই হাাপচিনবা", hotelInformation: "🏨 হোতেল মারোল", hotelName: "হোতেলগী মিং", shiftPolicy: "⏰ মতমগী নিয়মশিং",
    defaultShiftStart: "হৌগদবা মতম", defaultShiftEnd: "লোইগদবা মতম", gracePeriod: "হেন্দোকপা মতম (মিনিৎ)", savePolicy: "💾 নিয়মশিং সেভ তৌবা", individualShiftTimings: "👥 অমমমগী শিফ্ত মতম", resetData: "⚠️ পুম্নমক রীসেত তৌবা",
    goodMorning: "অয়েংবা অমসুং নুংশিরবা!", goodAfternoon: "নুংথিলগী তরাম্না ওকচরি!", goodEvening: "নুমিদাংগী তরাম্না ওকচরি!", checkInPhoto: "📸 লাইভ ফোতোগা লোইননা চেক ইন তৌবিয়ু", checkOutPhoto: "📤 লাইভ ফোতোগা লোইননা চেক আউত তৌবিয়ু", notCheckedIn: "চেক ইন তৌদ্রি", tapToCheckIn: "চেক ইন তৌনবগীদমক মখাগী বতন থুগানু", attendanceHistory: "📅 ইগী লেপপগী ইতিহাস", noHistory: "📭 লেপপগী ইতিহাস লৈত্রি",
    invalidAdmin: "অশেংবা এডমিন নত্তে", invalidStaff: "অশেংবা আইডি নত্রগা পাসৱার্দ নত্তে", welcomeBack: "তরাম্না ওকচরি, {name}!", welcomeStaff: "তরাম্না ওকচরি, {name}!"
  },
  mr: {
    language: "भाषा", hotelLemon: "हॉटेल लेमन", adminDashboard: "ॲडमिन डॅशबोर्ड", staffAttendance: "कर्मचारी उपस्थिती प्रणाली", staffPortal: "कर्मचारी पोर्टल",
    adminLogin: "🔑 ॲडमिन लॉगिन", staffLogin: "👤 कर्मचारी लॉगिन", username: "वापरकर्ता नाव", password: "पासवर्ड", employeeId: "कर्मचारी आयडी",
    enterAdminUsername: "ॲडमिन वापरकर्ता नाव प्रविष्ट करा", enterPassword: "पासवर्ड प्रविष्ट करा", enterEmployeeId: "उदा. EMP001", signInAdmin: "ॲडमिन म्हणून साइन इन करा →", signInStaff: "कर्मचारी म्हणून साइन इन करा →",
    dashboard: "डॅशबोर्ड", dashboardOverview: "डॅशबोर्ड विहंगावलोकन", attendance: "उपस्थिती", staffManagement: "कर्मचारी व्यवस्थापन", settings: "सेटिंग्ज", logout: "लॉगआउट",
    totalStaff: "एकूण कर्मचारी", presentToday: "आज उपस्थित", absent: "अनुपस्थित", lateArrivals: "उशिरा आलेले", todaysActivity: "🕐 आजची क्रियाकलाप", noAttendanceRecords: "आजची कोणतीही उपस्थिती नोंद नाही",
    searchByNameOrId: "🔍 नाव किंवा आयडीने शोध घ्या...", allDepartments: "सर्व विभाग", exportCsv: "📥 CSV निर्यात करा", noRecordsFound: "📭 कोणतीही नोंद सापडली नाही",
    activeStaffMembers: "सक्रिय कर्मचारी", addStaff: "➕ कर्मचारी जोडा", hotelInformation: "🏨 हॉटेल माहिती", hotelName: "हॉटेलचे नाव", shiftPolicy: "⏰ शिफ्ट वेळ धोरण आणि नियम",
    defaultShiftStart: "डिफॉल्ट शिफ्ट सुरू होण्याची वेळ", defaultShiftEnd: "डिफॉल्ट शिफ्ट संपण्याची वेळ", gracePeriod: "सवलतीचा वेळ (मिनिटे)", savePolicy: "💾 धोरण सेटिंग्ज जतन करा", individualShiftTimings: "👥 वैयक्तिक कर्मचारी शिफ्ट वेळा", resetData: "⚠️ सर्व डेटा रीसेट करा",
    goodMorning: "शुभ सकाळ!", goodAfternoon: "शुभ दुपार!", goodEvening: "शुभ संध्या!", checkInPhoto: "📸 लाईव्ह फोटोसह चेक इन करा", checkOutPhoto: "📤 लाईव्ह फोटोसह चेक आउट करा", notCheckedIn: "अद्याप चेक इन केलेले नाही", tapToCheckIn: "लाईव्ह फोटोसह चेक इन करण्यासाठी खालील बटणावर टॅप करा", attendanceHistory: "📅 माझा उपस्थिती इतिहास", noHistory: "📭 अद्याप कोणताही उपस्थिती इतिहास नाही",
    invalidAdmin: "अवैध ॲडमिन माहिती", invalidStaff: "अवैध कर्मचारी आयडी किंवा पासवर्ड", welcomeBack: "पुन्हा स्वागत आहे, {name}!", welcomeStaff: "स्वागत आहे, {name}!"
  },
  ne: {
    language: "भाषा", hotelLemon: "होटल लेमन", adminDashboard: "एडमिन ड्यासबोर्ड", staffAttendance: "कर्मचारी उपस्थिति प्रणाली", staffPortal: "कर्मचारी पोर्टल",
    adminLogin: "🔑 एडमिन लगइन", staffLogin: "👤 कर्मचारी लगइन", username: "प्रयोगकर्ता नाम", password: "पासवर्ड", employeeId: "कर्मचारी आईडी",
    enterAdminUsername: "एडमिन प्रयोगकर्ता नाम राख्नुहोस्", enterPassword: "पासवर्ड राख्नुहोस्", enterEmployeeId: "जस्तै EMP001", signInAdmin: "एडमिनको रूपमा लगइन गर्नुहोस् →", signInStaff: "कर्मचारीको रूपमा लगइन गर्नुहोस् →",
    dashboard: "ड्यासबोर्ड", dashboardOverview: "ड्यासबोर्ड सिंहावलोकन", attendance: "उपस्थिति", staffManagement: "कर्मचारी व्यवस्थापन", settings: "सेटिङहरू", logout: "लगआउट",
    totalStaff: "कुल कर्मचारी", presentToday: "आज उपस्थित", absent: "अनुपस्थित", lateArrivals: "ढिलो आएका", todaysActivity: "🕐 आजको गतिविधि", noAttendanceRecords: "आजको कुनै उपस्थिति रेकर्ड छैन",
    searchByNameOrId: "🔍 नाम वा आईडीबाट खोज्नुहोस्...", allDepartments: "सबै विभागहरू", exportCsv: "📥 CSV निर्यात गर्नुहोस्", noRecordsFound: "📭 कुनै रेकर्ड भेटिएन",
    activeStaffMembers: "सक्रिय कर्मचारीहरू", addStaff: "➕ कर्मचारी थप्नुहोस्", hotelInformation: "🏨 होटल जानकारी", hotelName: "होटलको नाम", shiftPolicy: "⏰ सिफ्ट समय नीति र नियमहरू",
    defaultShiftStart: "पूर्वनिर्धारित सिफ्ट सुरु समय", defaultShiftEnd: "पूर्वनिर्धारित सिफ्ट अन्त्य समय", gracePeriod: "छुट समय (मिनेट)", savePolicy: "💾 नीति सेटिङहरू बचत गर्नुहोस्", individualShiftTimings: "👥 व्यक्तिगत सिफ्ट समय", resetData: "⚠️ सबै डाटा रिसेट गर्नुहोस्",
    goodMorning: "शुभ बिहानी!", goodAfternoon: "शुभ दिउँसो!", goodEvening: "शुभ साँझ!", checkInPhoto: "📸 लाइभ फोटोसहित चेक इन गर्नुहोस्", checkOutPhoto: "📤 लाइभ फोटोसहित चेक आउट गर्नुहोस्", notCheckedIn: "चेक इन गरिएको छैन", tapToCheckIn: "लाइभ फोटोसहित चेक इन गर्न तलको बटन थिच्नुहोस्", attendanceHistory: "📅 मेरो उपस्थिति इतिहास", noHistory: "📭 अहिलेसम्म कुनै उपस्थिति इतिहास छैन",
    invalidAdmin: "अमान्य एडमिन विवरण", invalidStaff: "अमान्य कर्मचारी आईडी वा पासवर्ड", welcomeBack: "स्वागत छ, {name}!", welcomeStaff: "स्वागत छ, {name}!"
  },
  or: {
    language: "ଭାଷା", hotelLemon: "ହୋଟେଲ ଲେମନ୍", adminDashboard: "ଆଡମିନ୍ ଡ୍ୟାସବୋର୍ଡ", staffAttendance: "କର୍ମଚାରୀ ଉପସ୍ଥାନ ପ୍ରଣାଳୀ", staffPortal: "କର୍ମଚାରୀ ପୋର୍ଟାଲ୍",
    adminLogin: "🔑 ଆଡମିନ୍ ଲଗଇନ୍", staffLogin: "👤 କର୍ମଚାରୀ ଲଗଇନ୍", username: "ବ୍ୟବହାରକାରୀ ନାମ", password: "ପାସୱାର୍ଡ", employeeId: "କର୍ମଚାରୀ ଆଇଡି",
    enterAdminUsername: "ଆଡମିନ୍ ୟୁଜରନେମ୍ ଦିଅନ୍ତୁ", enterPassword: "ପାସୱାର୍ଡ ଦିଅନ୍ତୁ", enterEmployeeId: "ଯେପରିକି EMP001", signInAdmin: "ଆଡମିନ୍ ଭାବରେ ସାଇନ୍ ଇନ୍ କରନ୍ତୁ →", signInStaff: "କର୍ମଚାରୀ ଭାବରେ ସାଇନ୍ ଇନ୍ କରନ୍ତୁ →",
    dashboard: "ଡ୍ୟାସବୋର୍ଡ", dashboardOverview: "ଡ୍ୟାସବୋର୍ଡ ସମୀକ୍ଷା", attendance: "ଉପସ୍ଥାନ", staffManagement: "କର୍ମଚାରୀ ପରିଚାଳନା", settings: "ସେଟିଂସ", logout: "ଲଗଆଉଟ୍",
    totalStaff: "ମୋଟ କର୍ମଚାରୀ", presentToday: "ଆଜି ଉପସ୍ଥିତ", absent: "ଅନୁପସ୍ଥିତ", lateArrivals: "ବିଳମ୍ବରେ ଆସିଥିବା", todaysActivity: "🕐 ଆଜିର କାର୍ଯ୍ୟକଳାପ", noAttendanceRecords: "ଆଜି ପାଇଁ କୌଣସି ଉପସ୍ଥାନ ରେକର୍ଡ ନାହିଁ",
    searchByNameOrId: "🔍 ନାମ କିମ୍ବା ଆଇଡି ଦ୍ୱାରା ଖୋଜନ୍ତୁ...", allDepartments: "ସମସ୍ତ ବିଭାଗ", exportCsv: "📥 CSV ରପ୍ତାନି କରନ୍ତୁ", noRecordsFound: "📭 କୌଣସି ରେକର୍ଡ ମିଳିଲା ନାହିଁ",
    activeStaffMembers: "ସକ୍ରିୟ କର୍ମଚାରୀ", addStaff: "➕ କର୍ମଚାରୀ ଯୋଡନ୍ତୁ", hotelInformation: "🏨 ହୋଟେଲ ସୂଚନା", hotelName: "ହୋଟେଲ ନାମ", shiftPolicy: "⏰ ଶିଫ୍ଟ ସମୟ ନୀତି ଏବଂ ନିୟମ",
    defaultShiftStart: "ଡିଫଲ୍ଟ ଶିଫ୍ଟ ଆରମ୍ଭ ସମୟ", defaultShiftEnd: "ଡିଫଲ୍ଟ ଶିଫ୍ଟ ଶେଷ ସମୟ", gracePeriod: "ରିହାତି ସମୟ (ମିନିଟ୍)", savePolicy: "💾 ନୀତି ସେଟିଂସ ସଂରକ୍ଷଣ କରନ୍ତୁ", individualShiftTimings: "👥 ବ୍ୟକ୍ତିଗତ କର୍ମଚାରୀ ଶିଫ୍ଟ ସମୟ", resetData: "⚠️ ସମସ୍ତ ଡାଟା ରିସେଟ୍ କରନ୍ତୁ",
    goodMorning: "ଶୁଭ ସକାଳ!", goodAfternoon: "ଶୁଭ ଅପରାହ୍ନ!", goodEvening: "ଶୁଭ ସନ୍ଧ୍ୟା!", checkInPhoto: "📸 ଲାଇଭ୍ ଫଟୋ ସହିତ ଚେକ୍ ଇନ୍ କରନ୍ତୁ", checkOutPhoto: "📤 ଲାଇଭ୍ ଫଟୋ ସହିତ ଚେକ୍ ଆଉଟ୍ କରନ୍ତୁ", notCheckedIn: "ଚେକ୍ ଇନ୍ ହୋଇନାହିଁ", tapToCheckIn: "ଲାଇଭ୍ ଫଟୋ ସହିତ ଚେକ୍ ଇନ୍ କରିବାକୁ ତଳ ବଟନ୍ ଟାପ୍ କରନ୍ତୁ", attendanceHistory: "📅 ମୋର ଉପସ୍ଥାନ ଇତିହାସ", noHistory: "📭 କୌଣସି ଉପସ୍ଥାନ ଇତିହାସ ନାହିଁ",
    invalidAdmin: "ଅବୈଧ ଆଡମିନ୍ ବିବରଣୀ", invalidStaff: "ଅବୈଧ କର୍ମଚାରୀ ଆଇଡି କିମ୍ବା ପାସୱାର୍ଡ", welcomeBack: "ପୁନର୍ବାର ସ୍ୱାଗତ, {name}!", welcomeStaff: "ସ୍ୱାଗତ, {name}!"
  },
  pa: {
    language: "ਭਾਸ਼ਾ", hotelLemon: "ਹੋਟਲ ਲੈਮਨ", adminDashboard: "ਐਡਮਿਨ ਡੈਸ਼ਬੋਰਡ", staffAttendance: "ਸਟਾਫ਼ ਹਾਜ਼ਰੀ ਸਿਸਟਮ", staffPortal: "ਸਟਾਫ਼ ਪੋਰਟਲ",
    adminLogin: "🔑 ਐਡਮਿਨ ਲੌਗਇਨ", staffLogin: "👤 ਸਟਾਫ਼ ਲੌਗਇਨ", username: "ਯੂਜ਼ਰਨਾਮ", password: "ਪਾਸਵਰਡ", employeeId: "ਕਰਮਚਾਰੀ ਆਈਡੀ",
    enterAdminUsername: "ਐਡਮਿਨ ਯੂਜ਼ਰਨਾਮ ਦਰਜ ਕਰੋ", enterPassword: "ਪਾਸਵਰਡ ਦਰਜ ਕਰੋ", enterEmployeeId: "ਜਿਵੇਂ EMP001", signInAdmin: "ਐਡਮਿਨ ਵਜੋਂ ਲੌਗਇਨ ਕਰੋ →", signInStaff: "ਸਟਾਫ਼ ਵਜੋਂ ਲੌਗਇਨ ਕਰੋ →",
    dashboard: "ਡੈਸ਼ਬੋਰਡ", dashboardOverview: "ਡੈਸ਼ਬੋਰਡ ਸਮੀਖਿਆ", attendance: "ਹਾਜ਼ਰੀ", staffManagement: "ਸਟਾਫ਼ ਪ੍ਰਬੰਧਨ", settings: "ਸੈਟਿੰਗਾਂ", logout: "ਲੌਗਆਊਟ",
    totalStaff: "ਕੁੱਲ ਸਟਾਫ਼", presentToday: "ਅੱਜ ਹਾਜ਼ਰ", absent: "ਗੈਰ-ਹਾਜ਼ਰ", lateArrivals: "ਦੇਰੀ ਨਾਲ ਆਏ", todaysActivity: "🕐 ਅੱਜ ਦੀ ਗਤੀਵਿਧੀ", noAttendanceRecords: "ਅੱਜ ਦਾ ਕੋਈ ਹਾਜ਼ਰੀ ਰਿਕਾਰਡ ਨਹੀਂ ਹੈ",
    searchByNameOrId: "🔍 ਨਾਮ ਜਾਂ ਆਈਡੀ ਨਾਲ ਖੋਜੋ...", allDepartments: "ਸਾਰੇ ਵਿਭਾਗ", exportCsv: "📥 CSV ਐਕਸਪੋਰਟ ਕਰੋ", noRecordsFound: "📭 ਕੋਈ ਰਿਕਾਰਡ ਨਹੀਂ ਮਿਲਿਆ",
    activeStaffMembers: "ਸਰਗਰਮ ਸਟਾਫ਼ ਮੈਂਬਰ", addStaff: "➕ ਸਟਾਫ਼ ਸ਼ਾਮਲ ਕਰੋ", hotelInformation: "🏨 ਹੋਟਲ ਜਾਣਕਾਰੀ", hotelName: "ਹੋਟਲ ਦਾ ਨਾਮ", shiftPolicy: "⏰ ਸ਼ਿਫਟ ਸਮਾਂ ਨੀਤੀ ਅਤੇ ਨਿਯਮ",
    defaultShiftStart: "ਡਿਫਾਲਟ ਸ਼ਿਫਟ ਸ਼ੁਰੂ ਸਮਾਂ", defaultShiftEnd: "ਡਿਫਾਲਟ ਸ਼ਿਫਟ ਸਮਾਪਤੀ ਸਮਾਂ", gracePeriod: "ਛੋਟ ਦਾ ਸਮਾਂ (ਮਿੰਟ)", savePolicy: "💾 ਨੀਤੀ ਸੈਟਿੰਗਾਂ ਸੰਭਾਲੋ", individualShiftTimings: "👥 ਵਿਅਕਤੀਗਤ ਸਟਾਫ਼ ਸ਼ਿਫਟ ਸਮਾਂ", resetData: "⚠️ ਸਾਰਾ ਡਾਟਾ ਰੀਸੈਟ ਕਰੋ",
    goodMorning: "ਸ਼ੁਭ ਸਵੇਰ!", goodAfternoon: "ਸ਼ੁਭ ਦੁਪਹਿਰ!", goodEvening: "ਸ਼ੁਭ ਸ਼ਾਮ!", checkInPhoto: "📸 ਲਾਈਵ ਫੋਟੋ ਨਾਲ ਚੈੱਕ ਇਨ ਕਰੋ", checkOutPhoto: "📤 ਲਾਈਵ ਫੋਟੋ ਨਾਲ ਚੈੱਕ ਆਊਟ ਕਰੋ", notCheckedIn: "ਚੈੱਕ ਇਨ ਨਹੀਂ ਕੀਤਾ ਗਿਆ", tapToCheckIn: "ਲਾਈਵ ਫੋਟੋ ਨਾਲ ਚੈੱਕ ਇਨ ਕਰਨ ਲਈ ਹੇਠਾਂ ਦਿੱਤੇ ਬਟਨ 'ਤੇ ਟੈਪ ਕਰੋ", attendanceHistory: "📅 ਮੇਰੀ ਹਾਜ਼ਰੀ ਦਾ ਇਤਿਹਾਸ", noHistory: "📭 ਅਜੇ ਤੱਕ ਕੋਈ ਹਾਜ਼ਰੀ ਇਤਿਹਾਸ ਨਹੀਂ ਹੈ",
    invalidAdmin: "ਗਲਤ ਐਡਮਿਨ ਜਾਣਕਾਰੀ", invalidStaff: "ਗਲਤ ਕਰਮਚਾਰੀ ਆਈਡੀ ਜਾਂ ਪਾਸਵਰਡ", welcomeBack: "ਜੀ ਆਇਆਂ ਨੂੰ, {name}!", welcomeStaff: "ਜੀ ਆਇਆਂ ਨੂੰ, {name}!"
  },
  sa: {
    language: "भाषा", hotelLemon: "होटल् लेमन्", adminDashboard: "प्रशासक फलकम्", staffAttendance: "कर्मचारि उपस्थिति प्रणाली", staffPortal: "कर्मचारि द्वारम्",
    adminLogin: "🔑 प्रशासक प्रवेशः", staffLogin: "👤 कर्मचारि प्रवेशः", username: "उपयोक्तृनाम", password: "कूटशब्दः", employeeId: "कर्मचारि परिचयपत्रम्",
    enterAdminUsername: "प्रशासक उपयोक्तृनाम लिखतु", enterPassword: "कूटशब्दं लिखतु", enterEmployeeId: "यथा EMP001", signInAdmin: "प्रशासकरूपेण प्रविशतु →", signInStaff: "कर्मचारिरूपेण प्रविशतु →",
    dashboard: "मुख्यफलकम्", dashboardOverview: "मुख्यफलक विहङ्गावलोकनम्", attendance: "उपस्थितिः", staffManagement: "कर्मचारि प्रबन्धनम्", settings: "विन्यासाः", logout: "निर्गमः",
    totalStaff: "कुल कर्मचारिणः", presentToday: "अद्य उपस्थिताः", absent: "अनुपस्थिताः", lateArrivals: "विलम्बेन आगताः", todaysActivity: "🕐 अद्यतन गतिविधिः", noAttendanceRecords: "अद्य कोऽपि उपस्थिति अभिलेखः नास्ति",
    searchByNameOrId: "🔍 नाम्ना परिचयपत्रेण वा अन्विष्यताम्...", allDepartments: "सर्वे विभागाः", exportCsv: "📥 CSV निर्यातं करोतु", noRecordsFound: "📭 कोऽपि अभिलेखः न प्राप्तः",
    activeStaffMembers: "सक्रियाः कर्मचारिणः", addStaff: "➕ कर्मचारिणं योजयतु", hotelInformation: "🏨 होटल् सूचना", hotelName: "होटल् नाम", shiftPolicy: "⏰ कार्यसमय नियम नीतिश्च",
    defaultShiftStart: "मूल कार्यसमय प्रारम्भः", defaultShiftEnd: "मूल कार्यसमय समाप्तिः", gracePeriod: "अनुग्रह समयः (निमेषाः)", savePolicy: "💾 नीति विन्यासान् रक्षतु", individualShiftTimings: "👥 व्यक्तिगत कर्मचारि समयः", resetData: "⚠️ सर्वं दत्तमंशं पुनः स्थापयतु",
    goodMorning: "सुप्रभातम्!", goodAfternoon: "शुभमध्याह्नः!", goodEvening: "शुभसायङ्कालः!", checkInPhoto: "📸 सजीव चित्रेण सह प्रवेशं करोतु", checkOutPhoto: "📤 सजीव चित्रेण सह निर्गमं करोतु", notCheckedIn: "प्रवेशः न कृतः", tapToCheckIn: "सजीव चित्रेण सह प्रवेशार्थं अधः नुदतु", attendanceHistory: "📅 मम उपस्थिति इतिहासः", noHistory: "📭 अद्यापि कोऽपि उपस्थिति इतिहासः नास्ति",
    invalidAdmin: "अमान्य प्रशासक विवरणम्", invalidStaff: "अमान्य कर्मचारि सङ्ख्या कूटशब्दो वा", welcomeBack: "पुनः स्वागतम्, {name}!", welcomeStaff: "स्वागतम्, {name}!"
  },
  sat: {
    language: "ᱯᱟᱹᱨᱥᱤ", hotelLemon: "ᱦᱚᱴᱮᱞ ᱞᱮᱢᱚᱱ", adminDashboard: "ᱮᱰᱢᱤᱱ ᱰᱮᱥᱵᱳᱨᱰ", staffAttendance: "ᱠᱟᱹᱢᱤᱭᱟᱹ ᱥᱮᱴᱮᱨ ᱵᱮᱵᱚᱥᱛᱟ", staffPortal: "ᱠᱟᱹᱢᱤᱭᱟᱹ ᱯᱳᱨᱴᱟᱞ",
    adminLogin: "🔑 ᱮᱰᱢᱤᱱ ᱵᱚᱞᱚᱱ", staffLogin: "👤 ᱠᱟᱹᱢᱤᱭᱟᱹ ᱵᱚᱞᱚᱱ", username: "ᱵᱮᱣᱦᱟᱨᱤᱭᱟᱹ ᱧᱩᱛᱩᱢ", password: "ᱫᱟᱱᱟᱝ ᱥᱟᱵᱟᱫ", employeeId: "ᱠᱟᱹᱢᱤᱭᱟᱹ ᱟᱭᱰᱤ",
    enterAdminUsername: "ᱮᱰᱢᱤᱱ ᱧᱩᱛᱩᱢ ᱚᱞ ᱢᱮ", enterPassword: "ᱫᱟᱱᱟᱝ ᱥᱟᱵᱟᱫ ᱚᱞ ᱢᱮ", enterEmployeeId: "ᱡᱮᱞᱮᱠᱟ EMP001", signInAdmin: "ᱮᱰᱢᱤᱱ ᱞᱮᱠᱟᱛᱮ ᱵᱚᱞᱚᱱ ᱢᱮ →", signInStaff: "ᱠᱟᱹᱢᱤᱭᱟᱹ ᱞᱮᱠᱟᱛᱮ ᱵᱚᱞᱚᱱ ᱢᱮ →",
    dashboard: "ᱰᱮᱥᱵᱳᱨᱰ", dashboardOverview: "ᱰᱮᱥᱵᱳᱨᱰ ᱧᱮᱞ", attendance: "ᱥᱮᱴᱮᱨ", staffManagement: "ᱠᱟᱹᱢᱤᱭᱟᱹ ᱥᱟᱢᱴᱟᱣ", settings: "ᱥᱟᱡᱟᱣ", logout: "ᱚᱰᱳᱠ",
    totalStaff: "ᱡᱚᱛᱚ ᱠᱟᱹᱢᱤᱭᱟᱹ", presentToday: "ᱛᱮᱦᱮᱧ ᱥᱮᱴᱮᱨ", absent: "ᱵᱟᱝ ᱥᱮᱴᱮᱨ", lateArrivals: "ᱵᱤᱞᱚᱢ ᱥᱮᱴᱮᱨ", todaysActivity: "🕐 ᱛᱮᱦᱮᱧᱟᱜ ᱠᱟᱹᱢᱤ", noAttendanceRecords: "ᱛᱮᱦᱮᱧᱟᱜ ᱥᱮᱴᱮᱨ ᱨᱮᱠᱚᱨᱰ ᱵᱟᱹᱱᱩᱜᱼᱟ",
    searchByNameOrId: "🔍 ᱧᱩᱛᱩᱢ ᱥᱮ ᱟᱭᱰᱤ ᱛᱮ ᱯᱟᱸᱡᱟᱭ ᱢᱮ...", allDepartments: "ᱡᱚᱛᱚ ᱵᱷᱟᱜᱽ", exportCsv: "📥 CSV ᱚᱰᱳᱠ", noRecordsFound: "📭 ᱪᱮᱫ ᱨᱮᱠᱚᱨᱰ ᱦᱚᱸ ᱵᱟᱝ ᱧᱟᱢ ᱞᱮᱱᱟ",
    activeStaffMembers: "ᱠᱟᱹᱢᱤᱨᱮ ᱢᱮᱱᱟᱜ ᱠᱟᱹᱢᱤᱭᱟᱹ", addStaff: "➕ ᱠᱟᱹᱢᱤᱭᱟᱹ ᱥᱮᱞᱮᱫᱽ", hotelInformation: "🏨 ᱦᱚᱴᱮᱞ ᱞᱟᱹᱭ", hotelName: "ᱦᱚᱴᱮᱞ ᱧᱩᱛᱩᱢ", shiftPolicy: "⏰ ᱠᱟᱹᱢᱤ ᱚᱠᱛᱚ ᱱᱤᱭᱚᱢ",
    defaultShiftStart: "ᱮᱛᱚᱦᱚᱵ ᱚᱠᱛᱚ", defaultShiftEnd: "ᱢᱩᱪᱟᱹᱫ ᱚᱠᱛᱚ", gracePeriod: "ᱪᱷᱟᱹᱲ ᱚᱠᱛᱚ (ᱢᱤᱱᱤᱴ)", savePolicy: "💾 ᱱᱤᱭᱚᱢ ᱡᱚᱜᱟᱣ", individualShiftTimings: "👥 ᱱᱤᱡᱮᱨᱟᱜ ᱠᱟᱹᱢᱤ ᱚᱠᱛᱚ", resetData: "⚠️ ᱡᱚᱛᱚ ᱫᱚᱦᱲᱟ ᱥᱟᱡᱟᱣ",
    goodMorning: "ᱥᱟᱹᱜᱩᱱ ᱥᱮᱛᱟᱜ!", goodAfternoon: "ᱥᱟᱹᱜᱩᱱ ᱛᱤᱠᱤᱱ!", goodEvening: "ᱥᱟᱹᱜᱩᱱ ᱟᱹᱭᱩᱵ!", checkInPhoto: "📸 ᱞᱟᱭᱤᱵᱽ ᱯᱷᱳᱴᱳ ᱛᱮ ᱪᱮᱠ ᱤᱱ ᱢᱮ", checkOutPhoto: "📤 ᱞᱟᱭᱤᱵᱽ ᱯᱷᱳᱴᱳ ᱛᱮ ᱪᱮᱠ ᱟᱹᱣᱩᱴ ᱢᱮ", notCheckedIn: "ᱪᱮᱠ ᱤᱱ ᱵᱟᱝ ᱦᱩᱭ ᱟᱠᱟᱱᱟ", tapToCheckIn: "ᱪᱮᱠ ᱤᱱ ᱞᱟᱹᱜᱤᱫ ᱞᱟᱛᱟᱨ ᱵᱟᱴᱚᱱ ᱛᱟ component ᱢᱮ", attendanceHistory: "📅 ᱤᱧᱟᱜ ᱥᱮᱴᱮᱨ ᱱᱟᱜᱟᱢ", noHistory: "📭 ᱥᱮᱴᱮᱨ ᱱᱟᱜᱟᱢ ᱵᱟᱹᱱᱩᱜᱼᱟ",
    invalidAdmin: "ᱵᱟᱹᱲᱤᱡ ᱮᱰᱢᱤᱱ ᱞᱟᱹᱭ", invalidStaff: "ᱵᱟᱹᱲᱤᱡ ᱟᱭᱰᱤ ᱥᱮ ᱫᱟᱱᱟᱝ ᱥᱟᱵᱟᱫ", welcomeBack: "ᱥᱟᱹᱜᱩᱱ ᱫᱟᱨᱟᱢ, {name}!", welcomeStaff: "ᱥᱟᱹᱜᱩᱱ ᱫᱟᱨᱟᱢ, {name}!"
  },
  sd: {
    language: "ٻولي", hotelLemon: "هوٽل ليمن", adminDashboard: "ايڊمن ڊيش بورڊ", staffAttendance: "اسٽاف جي حاضري جو نظام", staffPortal: "اسٽاف پورٽل",
    adminLogin: "🔑 ايڊمن لاگ ان", staffLogin: "👤 اسٽاف لاگ ان", username: "يوزر نام", password: "پاسورڊ", employeeId: "ملازم آئي ڊي",
    enterAdminUsername: "ايڊمن يوزر نام داخل ڪريو", enterPassword: "پاسورڊ داخل ڪريو", enterEmployeeId: "مثال EMP001", signInAdmin: "ايڊمن طور سائن ان ٿيو →", signInStaff: "اسٽاف طور سائن ان ٿيو →",
    dashboard: "ڊيش بورڊ", dashboardOverview: "ڊيش بورڊ جو جائزو", attendance: "حاضري", staffManagement: "اسٽاف جو انتظام", settings: "سيٽنگون", logout: "لاگ آئوٽ",
    totalStaff: "ڪل اسٽاف", presentToday: "اڄ حاضر", absent: "غير حاضر", lateArrivals: "دير سان آيل", todaysActivity: "🕐 اڄ جي سرگرمي", noAttendanceRecords: "اڄ جي ڪائي حاضري رڪارڊ ناهي",
    searchByNameOrId: "🔍 نالي يا آئي ڊي سان ڳوليو...", allDepartments: "سڀ شعبا", exportCsv: "📥 CSV برآمد ڪريو", noRecordsFound: "📭 ڪو به رڪارڊ نه مليو",
    activeStaffMembers: "فعال اسٽاف ميمبر", addStaff: "➕ اسٽاف شامل ڪريو", hotelInformation: "🏨 هوٽل جي معلومات", hotelName: "هوٽل جو نالو", shiftPolicy: "⏰ شفٽ وقت پاليسي",
    defaultShiftStart: "شروعاتي وقت", defaultShiftEnd: "پڄاڻي جو وقت", gracePeriod: "مهلت جو وقت (منٽ)", savePolicy: "💾 پاليسي سيٽنگون محفوظ ڪريو", individualShiftTimings: "👥 انفرادي شفٽ وقت", resetData: "⚠️ سڀ ڊيٽا ريسيٽ ڪريو",
    goodMorning: "صبح جو سلام!", goodAfternoon: "ٻپهر جو سلام!", goodEvening: "شام جو سلام!", checkInPhoto: "📸 لائيو فوٽو سان چيڪ ان ڪريو", checkOutPhoto: "📤 لائيو فوٽو سان چيڪ آئوٽ ڪريو", notCheckedIn: "چيڪ ان ناهي ٿيل", tapToCheckIn: "چيڪ ان ڪرڻ لاءِ هيٺين بٽڻ تي ڪلڪ ڪريو", attendanceHistory: "📅 منهنجي حاضري جي تاريخ", noHistory: "📭 اڃا ڪائي حاضري تاريخ ناهي",
    invalidAdmin: "غلط ايڊمن معلومات", invalidStaff: "غلط آئي ڊي يا پاسورڊ", welcomeBack: "ڀلي ڪري آيا، {name}!", welcomeStaff: "ڀلي ڪري آيا، {name}!"
  },
  te: {
    language: "భాష", hotelLemon: "హోటల్ లెమన్", adminDashboard: "అడ్మిన్ డాష్‌బోర్డ్", staffAttendance: "సిబ్బంది హాజరు వ్యవస్థ", staffPortal: "సిబ్బంది పోర్టల్",
    adminLogin: "🔑 అడ్మిన్ లాగిన్", staffLogin: "👤 సిబ్బంది లాగిన్", username: "యూజర్‌నేమ్", password: "పాస్‌వర్డ్", employeeId: "ఉద్యోగి ఐడీ",
    enterAdminUsername: "అడ్మిన్ యూజర్‌నేమ్ నమోదు చేయండి", enterPassword: "పాస్‌వర్డ్ నమోదు చేయండి", enterEmployeeId: "ఉదా: EMP001", signInAdmin: "అడ్మిన్‌గా సైన్ ఇన్ చేయండి →", signInStaff: "సిబ్బందిగా సైన్ ఇన్ చేయండి →",
    dashboard: "డాష్‌బోర్డ్", dashboardOverview: "డాష్‌బోర్డ్ అవలోకనం", attendance: "హాజరు", staffManagement: "సిబ్బంది నిర్వహణ", settings: "సెట్టింగ్‌లు", logout: "లాగౌట్",
    totalStaff: "మొత్తం సిబ్బంది", presentToday: "ఈరోజు హాజరైనవారు", absent: "గైర్హాజరైనవారు", lateArrivals: "ఆలస్యంగా వచ్చినవారు", todaysActivity: "🕐 ఈరోజు యాక్టివిటీ", noAttendanceRecords: "ఈరోజు హాజరు రికార్డులు లేవు",
    searchByNameOrId: "🔍 పేరు లేదా ఐడీ ద్వారా శోధించండి...", allDepartments: "అన్ని విభాగాలు", exportCsv: "📥 CSV ఎగుమతి చేయండి", noRecordsFound: "📭 రికార్డులు ఏవీ కనుగొనబడలేదు",
    activeStaffMembers: "యాక్టివ్ సిబ్బంది", addStaff: "➕ సిబ్బందిని జోడించండి", hotelInformation: "🏨 హోటల్ సమాచారం", hotelName: "హోటల్ పేరు", shiftPolicy: "⏰ షిఫ్ట్ సమయాల విధానం & నిబంధనలు",
    defaultShiftStart: "డిఫాల్ట్ షిఫ్ట్ ప్రారంభ సమయం", defaultShiftEnd: "డిఫాల్ట్ షిఫ్ట్ ముగింపు సమయం", gracePeriod: "మినహాయింపు సమయం (నిమిషాలు)", savePolicy: "💾 పాలసీ సెట్టింగ్‌లను సేవ్ చేయండి", individualShiftTimings: "👥 వ్యక్తిగత షిఫ్ట్ సమయాలు", resetData: "⚠️ మొత్తం డేటాను రీసెట్ చేయండి",
    goodMorning: "శుభోదయం!", goodAfternoon: "శుభ మధ్యాహ్నం!", goodEvening: "శుభ సాయంత్రం!", checkInPhoto: "📸 లైవ్ ఫోటోతో చెక్ ఇన్ చేయండి", checkOutPhoto: "📤 లైవ్ ఫోటోతో చెక్ అవుట్ చేయండి", notCheckedIn: "ఇంకా చెక్ ఇన్ చేయలేదు", tapToCheckIn: "లైవ్ ఫోటోతో చెక్ ఇన్ చేయడానికి క్రింది బటన్‌ను నొక్కండి", attendanceHistory: "📅 నా హాజరు చరిత్ర", noHistory: "📭 ఇంకా హాజరు చరిత్ర లేదు",
    invalidAdmin: "చెల్లని అడ్మిన్ వివరాలు", invalidStaff: "చెల్లని ఉద్యోగి ఐడీ లేదా పాస్‌వర్డ్", welcomeBack: "తిరిగి స్వాగతం, {name}!", welcomeStaff: "స్వాగతం, {name}!"
  },
  ur: {
    language: "زبان", hotelLemon: "ہوٹل لیمن", adminDashboard: "ایڈمن ڈیش بورڈ", staffAttendance: "اسٹاف کی حاضری کا نظام", staffPortal: "اسٹاف پورٹل",
    adminLogin: "🔑 ایڈمن لاگ ان", staffLogin: "👤 اسٹاف لاگ ان", username: "صارف کا نام", password: "پاس ورڈ", employeeId: "ملازم کی آئی ڈی",
    enterAdminUsername: "ایڈمن یوزر نیم درج کریں", enterPassword: "پاس ورڈ درج کریں", enterEmployeeId: "مثلاً EMP001", signInAdmin: "بطور ایڈمن سائن ان کریں →", signInStaff: "بطور اسٹاف سائن ان کریں →",
    dashboard: "ڈیش بورڈ", dashboardOverview: "ڈیش بورڈ کا جائزہ", attendance: "حاضری", staffManagement: "اسٹاف کی دیکھ بھال", settings: "سیٹنگز", logout: "لاگ آؤٹ",
    totalStaff: "کل اسٹاف", presentToday: "آج حاضر", absent: "غیر حاضر", lateArrivals: "تاخیر سے آنے والے", todaysActivity: "🕐 آج کی سرگرمی", noAttendanceRecords: "آج کا کوئی بھی حاضری ریکارڈ نہیں ہے",
    searchByNameOrId: "🔍 نام یا آئی ڈی سے تلاش کریں...", allDepartments: "تمام شعبے", exportCsv: "📥 CSV برآمد کریں", noRecordsFound: "📭 کوئی ریکارڈ نہیں ملا",
    activeStaffMembers: "فعال اسٹاف ممبران", addStaff: "➕ اسٹاف شامل کریں", hotelInformation: "🏨 ہوٹل کی معلومات", hotelName: "ہوٹل کا نام", shiftPolicy: "⏰ شفٹ کے اوقات کی پالیسی",
    defaultShiftStart: "پہلے سے طے شدہ شفٹ شروع", defaultShiftEnd: "پہلے سے طے شدہ شفٹ ختم", gracePeriod: "مہلت کا وقت (منٹ)", savePolicy: "💾 پالیسی سیٹنگز محفوظ کریں", individualShiftTimings: "👥 انفرادی اسٹاف شفٹ اوقات", resetData: "⚠️ تمام ڈیٹا ری سیٹ کریں",
    goodMorning: "صبح بخیر!", goodAfternoon: "دوپہر بخیر!", goodEvening: "شام بخیر!", checkInPhoto: "📸 لائیو تصویر کے ساتھ چیک ان کریں", checkOutPhoto: "📤 لائیو تصویر کے ساتھ چیک آؤٹ کریں", notCheckedIn: "چیک ان نہیں ہوا", tapToCheckIn: "لائیو تصویر کے ساتھ چیک ان کرنے کے لیے نیچے کا بٹن دبائیں", attendanceHistory: "📅 میری حاضری کی ہسٹری", noHistory: "📭 ابھی تک کوئی حاضری کی ہسٹری نہیں ہے",
    invalidAdmin: "غلط ایڈمن معلومات", invalidStaff: "غلط اسٹاف آئی ڈی یا پاس ورڈ", welcomeBack: "خوش آمدید، {name}!", welcomeStaff: "خوش آمدید، {name}!"
  }
};

const dirs = [
  path.join(__dirname, '../locales'),
  path.join(__dirname, '../www/locales')
];

dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

Object.entries(locales).forEach(([code, data]) => {
  dirs.forEach(dir => {
    const filePath = path.join(dir, `${code}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Saved ${filePath}`);
  });
});
