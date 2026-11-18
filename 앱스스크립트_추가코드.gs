/**
 * ===== 스마트기기 관리 사이트(GitHub Pages)용 추가 코드 =====
 *
 * 사용법
 *  1) 시트 → 확장 프로그램 → Apps Script 를 열어요.
 *  2) Code.gs 맨 아래에 이 파일 내용을 전부 붙여넣고 저장(Ctrl+S)해요.
 *     (기존 코드는 지우거나 고치지 않아도 돼요. 이 doGet 이 기존 doGet 을 대신해요.)
 *  3) 배포 → 배포 관리 → 연필 아이콘 → 버전: "새 버전" → 배포
 *     (액세스 권한은 지금처럼 "모든 사용자" 그대로 둬요.)
 *
 * 그러면 기존 웹앱 주소는 새 사이트에 데이터를 주는 역할만 하고,
 * 선생님들은 아래 사이트 주소로 접속하면 돼요.
 */

var SITE_URL_ = 'https://kitene0204.github.io/smart-device/';

// 기기 목록 주기 (GET ?api=list)
function doGet(e) {
  if (e && e.parameter && e.parameter.api === 'list') {
    return jsonOut_(function () {
      return getDeviceData();
    });
  }
  // 예전 주소로 들어온 사람은 새 사이트로 안내
  return HtmlService.createHtmlOutput(
    '<div style="font-family:sans-serif;text-align:center;padding:40px">' +
      '<p>스마트기기 관리 시스템 주소가 바뀌었어요.</p>' +
      '<p><a href="' + SITE_URL_ + '" target="_top" style="font-size:1.2em">' + SITE_URL_ + '</a></p>' +
    '</div>'
  ).setTitle('우리학교 스마트기기 관리 시스템');
}

// 대여·반납 처리 (POST)
function doPost(e) {
  return jsonOut_(function () {
    var p = JSON.parse(e.postData.contents);
    // processAction 안에서 잠금(LockService)을 이미 처리함
    return processAction(p.id, p.name || '', p.action, p.type);
  });
}

function jsonOut_(fn) {
  var out;
  try {
    out = { ok: true, data: fn() };
  } catch (err) {
    out = { ok: false, error: String((err && err.message) || err) };
  }
  return ContentService.createTextOutput(JSON.stringify(out))
    .setMimeType(ContentService.MimeType.JSON);
}
