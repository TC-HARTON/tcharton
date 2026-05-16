/**
 * area-search.js — トップページの「都道府県 → 市町村 → 業種」カスケード検索
 *
 * 自動生成: gen-area-search.js（手動編集禁止）
 * データソース: src/data/prefectures.json + src/data/areas-cities-industries.json
 *
 * CSP 適合（外部 src / inline なし）+ Trusted Types 安全（textContent / value のみ操作）
 *
 * 動作:
 *   scanned 都市 + 業種  → /areas/{citySlug}/{industry}/
 *   scanned 都市のみ     → /areas/{citySlug}/
 *   非 scanned 都市      → /areas/pref/{prefSlug}/（都道府県ハブ）
 *   都道府県のみ          → /areas/pref/{prefSlug}/
 */
(function() {
  'use strict';

  var IND_NAMES = {
    "tax": "税理士・会計事務所",
    "lawyer": "弁護士",
    "shihoshoshi": "司法書士",
    "gyoseishoshi": "行政書士",
    "realestate": "不動産",
    "restaurant": "飲食店",
    "salon": "美容院",
    "lodging": "宿泊施設",
    "dental": "歯科医院",
    "hospital": "病院",
    "clinic": "クリニック",
    "cosmeticclinic": "美容クリニック",
    "juku": "学習塾"
  };

  var DATA = {
    "北海道": {
      "pref_slug": "hokkaido",
      "cities": {
        "sapporo": {
          "name": "札幌市",
          "scanned": true,
          "industries": [
            "clinic",
            "cosmeticclinic",
            "gyoseishoshi",
            "juku",
            "lawyer",
            "lodging",
            "realestate",
            "restaurant",
            "salon",
            "shihoshoshi",
            "tax"
          ]
        },
        "函館市": {
          "name": "函館市",
          "scanned": false,
          "industries": []
        },
        "小樽市": {
          "name": "小樽市",
          "scanned": false,
          "industries": []
        },
        "旭川市": {
          "name": "旭川市",
          "scanned": false,
          "industries": []
        },
        "室蘭市": {
          "name": "室蘭市",
          "scanned": false,
          "industries": []
        },
        "釧路市": {
          "name": "釧路市",
          "scanned": false,
          "industries": []
        },
        "帯広市": {
          "name": "帯広市",
          "scanned": false,
          "industries": []
        },
        "北見市": {
          "name": "北見市",
          "scanned": false,
          "industries": []
        },
        "苫小牧市": {
          "name": "苫小牧市",
          "scanned": false,
          "industries": []
        },
        "江別市": {
          "name": "江別市",
          "scanned": false,
          "industries": []
        },
        "千歳市": {
          "name": "千歳市",
          "scanned": false,
          "industries": []
        }
      }
    },
    "青森県": {
      "pref_slug": "aomori",
      "cities": {
        "青森市": {
          "name": "青森市",
          "scanned": false,
          "industries": []
        },
        "弘前市": {
          "name": "弘前市",
          "scanned": false,
          "industries": []
        },
        "八戸市": {
          "name": "八戸市",
          "scanned": false,
          "industries": []
        }
      }
    },
    "岩手県": {
      "pref_slug": "iwate",
      "cities": {
        "盛岡市": {
          "name": "盛岡市",
          "scanned": false,
          "industries": []
        },
        "奥州市": {
          "name": "奥州市",
          "scanned": false,
          "industries": []
        },
        "一関市": {
          "name": "一関市",
          "scanned": false,
          "industries": []
        }
      }
    },
    "宮城県": {
      "pref_slug": "miyagi",
      "cities": {
        "仙台市": {
          "name": "仙台市",
          "scanned": false,
          "industries": []
        },
        "石巻市": {
          "name": "石巻市",
          "scanned": false,
          "industries": []
        }
      }
    },
    "秋田県": {
      "pref_slug": "akita",
      "cities": {
        "秋田市": {
          "name": "秋田市",
          "scanned": false,
          "industries": []
        },
        "横手市": {
          "name": "横手市",
          "scanned": false,
          "industries": []
        },
        "大仙市": {
          "name": "大仙市",
          "scanned": false,
          "industries": []
        }
      }
    },
    "山形県": {
      "pref_slug": "yamagata",
      "cities": {
        "山形市": {
          "name": "山形市",
          "scanned": false,
          "industries": []
        },
        "酒田市": {
          "name": "酒田市",
          "scanned": false,
          "industries": []
        },
        "鶴岡市": {
          "name": "鶴岡市",
          "scanned": false,
          "industries": []
        },
        "米沢市": {
          "name": "米沢市",
          "scanned": false,
          "industries": []
        }
      }
    },
    "福島県": {
      "pref_slug": "fukushima",
      "cities": {
        "福島市": {
          "name": "福島市",
          "scanned": false,
          "industries": []
        },
        "郡山市": {
          "name": "郡山市",
          "scanned": false,
          "industries": []
        },
        "いわき市": {
          "name": "いわき市",
          "scanned": false,
          "industries": []
        },
        "会津若松市": {
          "name": "会津若松市",
          "scanned": false,
          "industries": []
        }
      }
    },
    "茨城県": {
      "pref_slug": "ibaraki",
      "cities": {
        "水戸市": {
          "name": "水戸市",
          "scanned": false,
          "industries": []
        },
        "つくば市": {
          "name": "つくば市",
          "scanned": false,
          "industries": []
        },
        "日立市": {
          "name": "日立市",
          "scanned": false,
          "industries": []
        },
        "ひたちなか市": {
          "name": "ひたちなか市",
          "scanned": false,
          "industries": []
        },
        "土浦市": {
          "name": "土浦市",
          "scanned": false,
          "industries": []
        },
        "古河市": {
          "name": "古河市",
          "scanned": false,
          "industries": []
        }
      }
    },
    "栃木県": {
      "pref_slug": "tochigi",
      "cities": {
        "宇都宮市": {
          "name": "宇都宮市",
          "scanned": false,
          "industries": []
        },
        "小山市": {
          "name": "小山市",
          "scanned": false,
          "industries": []
        },
        "足利市": {
          "name": "足利市",
          "scanned": false,
          "industries": []
        },
        "栃木市": {
          "name": "栃木市",
          "scanned": false,
          "industries": []
        }
      }
    },
    "群馬県": {
      "pref_slug": "gunma",
      "cities": {
        "前橋市": {
          "name": "前橋市",
          "scanned": false,
          "industries": []
        },
        "高崎市": {
          "name": "高崎市",
          "scanned": false,
          "industries": []
        },
        "伊勢崎市": {
          "name": "伊勢崎市",
          "scanned": false,
          "industries": []
        },
        "太田市": {
          "name": "太田市",
          "scanned": false,
          "industries": []
        }
      }
    },
    "埼玉県": {
      "pref_slug": "saitama",
      "cities": {
        "さいたま市": {
          "name": "さいたま市",
          "scanned": false,
          "industries": []
        },
        "川口市": {
          "name": "川口市",
          "scanned": false,
          "industries": []
        },
        "川越市": {
          "name": "川越市",
          "scanned": false,
          "industries": []
        },
        "所沢市": {
          "name": "所沢市",
          "scanned": false,
          "industries": []
        },
        "越谷市": {
          "name": "越谷市",
          "scanned": false,
          "industries": []
        },
        "草加市": {
          "name": "草加市",
          "scanned": false,
          "industries": []
        },
        "春日部市": {
          "name": "春日部市",
          "scanned": false,
          "industries": []
        },
        "上尾市": {
          "name": "上尾市",
          "scanned": false,
          "industries": []
        },
        "熊谷市": {
          "name": "熊谷市",
          "scanned": false,
          "industries": []
        },
        "新座市": {
          "name": "新座市",
          "scanned": false,
          "industries": []
        },
        "狭山市": {
          "name": "狭山市",
          "scanned": false,
          "industries": []
        },
        "入間市": {
          "name": "入間市",
          "scanned": false,
          "industries": []
        },
        "朝霞市": {
          "name": "朝霞市",
          "scanned": false,
          "industries": []
        },
        "戸田市": {
          "name": "戸田市",
          "scanned": false,
          "industries": []
        },
        "三郷市": {
          "name": "三郷市",
          "scanned": false,
          "industries": []
        },
        "八潮市": {
          "name": "八潮市",
          "scanned": false,
          "industries": []
        },
        "志木市": {
          "name": "志木市",
          "scanned": false,
          "industries": []
        },
        "和光市": {
          "name": "和光市",
          "scanned": false,
          "industries": []
        },
        "富士見市": {
          "name": "富士見市",
          "scanned": false,
          "industries": []
        },
        "桶川市": {
          "name": "桶川市",
          "scanned": false,
          "industries": []
        },
        "東松山市": {
          "name": "東松山市",
          "scanned": false,
          "industries": []
        },
        "坂戸市": {
          "name": "坂戸市",
          "scanned": false,
          "industries": []
        },
        "深谷市": {
          "name": "深谷市",
          "scanned": false,
          "industries": []
        }
      }
    },
    "千葉県": {
      "pref_slug": "chiba",
      "cities": {
        "千葉市": {
          "name": "千葉市",
          "scanned": false,
          "industries": []
        },
        "船橋市": {
          "name": "船橋市",
          "scanned": false,
          "industries": []
        },
        "松戸市": {
          "name": "松戸市",
          "scanned": false,
          "industries": []
        },
        "市川市": {
          "name": "市川市",
          "scanned": false,
          "industries": []
        },
        "柏市": {
          "name": "柏市",
          "scanned": false,
          "industries": []
        },
        "市原市": {
          "name": "市原市",
          "scanned": false,
          "industries": []
        },
        "八千代市": {
          "name": "八千代市",
          "scanned": false,
          "industries": []
        },
        "流山市": {
          "name": "流山市",
          "scanned": false,
          "industries": []
        },
        "佐倉市": {
          "name": "佐倉市",
          "scanned": false,
          "industries": []
        },
        "茂原市": {
          "name": "茂原市",
          "scanned": false,
          "industries": []
        },
        "成田市": {
          "name": "成田市",
          "scanned": false,
          "industries": []
        },
        "習志野市": {
          "name": "習志野市",
          "scanned": false,
          "industries": []
        },
        "浦安市": {
          "name": "浦安市",
          "scanned": false,
          "industries": []
        },
        "我孫子市": {
          "name": "我孫子市",
          "scanned": false,
          "industries": []
        },
        "木更津市": {
          "name": "木更津市",
          "scanned": false,
          "industries": []
        },
        "印西市": {
          "name": "印西市",
          "scanned": false,
          "industries": []
        },
        "野田市": {
          "name": "野田市",
          "scanned": false,
          "industries": []
        }
      }
    },
    "東京都": {
      "pref_slug": "tokyo",
      "cities": {
        "世田谷区": {
          "name": "世田谷区",
          "scanned": false,
          "industries": []
        },
        "練馬区": {
          "name": "練馬区",
          "scanned": false,
          "industries": []
        },
        "大田区": {
          "name": "大田区",
          "scanned": false,
          "industries": []
        },
        "江戸川区": {
          "name": "江戸川区",
          "scanned": false,
          "industries": []
        },
        "足立区": {
          "name": "足立区",
          "scanned": false,
          "industries": []
        },
        "杉並区": {
          "name": "杉並区",
          "scanned": false,
          "industries": []
        },
        "板橋区": {
          "name": "板橋区",
          "scanned": false,
          "industries": []
        },
        "江東区": {
          "name": "江東区",
          "scanned": false,
          "industries": []
        },
        "葛飾区": {
          "name": "葛飾区",
          "scanned": false,
          "industries": []
        },
        "品川区": {
          "name": "品川区",
          "scanned": false,
          "industries": []
        },
        "北区": {
          "name": "北区",
          "scanned": false,
          "industries": []
        },
        "新宿区": {
          "name": "新宿区",
          "scanned": false,
          "industries": []
        },
        "中野区": {
          "name": "中野区",
          "scanned": false,
          "industries": []
        },
        "豊島区": {
          "name": "豊島区",
          "scanned": false,
          "industries": []
        },
        "目黒区": {
          "name": "目黒区",
          "scanned": false,
          "industries": []
        },
        "shibuya": {
          "name": "渋谷区",
          "scanned": true,
          "industries": [
            "clinic",
            "cosmeticclinic",
            "gyoseishoshi",
            "juku",
            "lawyer",
            "lodging",
            "realestate",
            "restaurant",
            "salon",
            "shihoshoshi",
            "tax"
          ]
        },
        "港区": {
          "name": "港区",
          "scanned": false,
          "industries": []
        },
        "墨田区": {
          "name": "墨田区",
          "scanned": false,
          "industries": []
        },
        "台東区": {
          "name": "台東区",
          "scanned": false,
          "industries": []
        },
        "文京区": {
          "name": "文京区",
          "scanned": false,
          "industries": []
        },
        "千代田区": {
          "name": "千代田区",
          "scanned": false,
          "industries": []
        },
        "中央区": {
          "name": "中央区",
          "scanned": false,
          "industries": []
        },
        "荒川区": {
          "name": "荒川区",
          "scanned": false,
          "industries": []
        },
        "八王子市": {
          "name": "八王子市",
          "scanned": false,
          "industries": []
        },
        "町田市": {
          "name": "町田市",
          "scanned": false,
          "industries": []
        },
        "府中市": {
          "name": "府中市",
          "scanned": false,
          "industries": []
        },
        "調布市": {
          "name": "調布市",
          "scanned": false,
          "industries": []
        },
        "西東京市": {
          "name": "西東京市",
          "scanned": false,
          "industries": []
        },
        "小平市": {
          "name": "小平市",
          "scanned": false,
          "industries": []
        },
        "武蔵野市": {
          "name": "武蔵野市",
          "scanned": false,
          "industries": []
        },
        "三鷹市": {
          "name": "三鷹市",
          "scanned": false,
          "industries": []
        },
        "日野市": {
          "name": "日野市",
          "scanned": false,
          "industries": []
        },
        "立川市": {
          "name": "立川市",
          "scanned": false,
          "industries": []
        },
        "東村山市": {
          "name": "東村山市",
          "scanned": false,
          "industries": []
        },
        "多摩市": {
          "name": "多摩市",
          "scanned": false,
          "industries": []
        },
        "国分寺市": {
          "name": "国分寺市",
          "scanned": false,
          "industries": []
        },
        "小金井市": {
          "name": "小金井市",
          "scanned": false,
          "industries": []
        },
        "東久留米市": {
          "name": "東久留米市",
          "scanned": false,
          "industries": []
        },
        "青梅市": {
          "name": "青梅市",
          "scanned": false,
          "industries": []
        },
        "昭島市": {
          "name": "昭島市",
          "scanned": false,
          "industries": []
        },
        "狛江市": {
          "name": "狛江市",
          "scanned": false,
          "industries": []
        },
        "東大和市": {
          "name": "東大和市",
          "scanned": false,
          "industries": []
        }
      }
    },
    "神奈川県": {
      "pref_slug": "kanagawa",
      "cities": {
        "横浜市": {
          "name": "横浜市",
          "scanned": false,
          "industries": []
        },
        "川崎市": {
          "name": "川崎市",
          "scanned": false,
          "industries": []
        },
        "相模原市": {
          "name": "相模原市",
          "scanned": false,
          "industries": []
        },
        "藤沢市": {
          "name": "藤沢市",
          "scanned": false,
          "industries": []
        },
        "横須賀市": {
          "name": "横須賀市",
          "scanned": false,
          "industries": []
        },
        "平塚市": {
          "name": "平塚市",
          "scanned": false,
          "industries": []
        },
        "茅ヶ崎市": {
          "name": "茅ヶ崎市",
          "scanned": false,
          "industries": []
        },
        "厚木市": {
          "name": "厚木市",
          "scanned": false,
          "industries": []
        },
        "大和市": {
          "name": "大和市",
          "scanned": false,
          "industries": []
        },
        "小田原市": {
          "name": "小田原市",
          "scanned": false,
          "industries": []
        },
        "鎌倉市": {
          "name": "鎌倉市",
          "scanned": false,
          "industries": []
        },
        "秦野市": {
          "name": "秦野市",
          "scanned": false,
          "industries": []
        },
        "海老名市": {
          "name": "海老名市",
          "scanned": false,
          "industries": []
        },
        "座間市": {
          "name": "座間市",
          "scanned": false,
          "industries": []
        },
        "伊勢原市": {
          "name": "伊勢原市",
          "scanned": false,
          "industries": []
        }
      }
    },
    "新潟県": {
      "pref_slug": "niigata",
      "cities": {
        "新潟市": {
          "name": "新潟市",
          "scanned": false,
          "industries": []
        },
        "長岡市": {
          "name": "長岡市",
          "scanned": false,
          "industries": []
        },
        "上越市": {
          "name": "上越市",
          "scanned": false,
          "industries": []
        }
      }
    },
    "富山県": {
      "pref_slug": "toyama",
      "cities": {
        "富山市": {
          "name": "富山市",
          "scanned": false,
          "industries": []
        },
        "高岡市": {
          "name": "高岡市",
          "scanned": false,
          "industries": []
        }
      }
    },
    "石川県": {
      "pref_slug": "ishikawa",
      "cities": {
        "金沢市": {
          "name": "金沢市",
          "scanned": false,
          "industries": []
        },
        "小松市": {
          "name": "小松市",
          "scanned": false,
          "industries": []
        },
        "白山市": {
          "name": "白山市",
          "scanned": false,
          "industries": []
        }
      }
    },
    "福井県": {
      "pref_slug": "fukui",
      "cities": {
        "福井市": {
          "name": "福井市",
          "scanned": false,
          "industries": []
        }
      }
    },
    "山梨県": {
      "pref_slug": "yamanashi",
      "cities": {
        "甲府市": {
          "name": "甲府市",
          "scanned": false,
          "industries": []
        },
        "甲斐市": {
          "name": "甲斐市",
          "scanned": false,
          "industries": []
        }
      }
    },
    "長野県": {
      "pref_slug": "nagano",
      "cities": {
        "長野市": {
          "name": "長野市",
          "scanned": false,
          "industries": []
        },
        "松本市": {
          "name": "松本市",
          "scanned": false,
          "industries": []
        },
        "上田市": {
          "name": "上田市",
          "scanned": false,
          "industries": []
        },
        "飯田市": {
          "name": "飯田市",
          "scanned": false,
          "industries": []
        }
      }
    },
    "岐阜県": {
      "pref_slug": "gifu",
      "cities": {
        "岐阜市": {
          "name": "岐阜市",
          "scanned": false,
          "industries": []
        },
        "大垣市": {
          "name": "大垣市",
          "scanned": false,
          "industries": []
        },
        "各務原市": {
          "name": "各務原市",
          "scanned": false,
          "industries": []
        },
        "多治見市": {
          "name": "多治見市",
          "scanned": false,
          "industries": []
        }
      }
    },
    "静岡県": {
      "pref_slug": "shizuoka-pref",
      "cities": {
        "shizuoka": {
          "name": "静岡市",
          "scanned": true,
          "industries": [
            "clinic",
            "cosmeticclinic",
            "gyoseishoshi",
            "juku",
            "lawyer",
            "lodging",
            "realestate",
            "restaurant",
            "salon",
            "shihoshoshi",
            "tax"
          ]
        },
        "hamamatsu": {
          "name": "浜松市",
          "scanned": true,
          "industries": [
            "clinic",
            "cosmeticclinic",
            "gyoseishoshi",
            "juku",
            "lawyer",
            "lodging",
            "realestate",
            "restaurant",
            "salon",
            "shihoshoshi",
            "tax"
          ]
        },
        "numazu": {
          "name": "沼津市",
          "scanned": true,
          "industries": [
            "cosmeticclinic",
            "gyoseishoshi",
            "hospital",
            "juku",
            "lawyer",
            "lodging",
            "realestate",
            "restaurant",
            "salon",
            "shihoshoshi",
            "tax",
            "dental"
          ]
        },
        "mishima": {
          "name": "三島市",
          "scanned": true,
          "industries": [
            "clinic",
            "cosmeticclinic",
            "gyoseishoshi",
            "juku",
            "lawyer",
            "lodging",
            "realestate",
            "restaurant",
            "salon",
            "shihoshoshi",
            "tax"
          ]
        },
        "fuji": {
          "name": "富士市",
          "scanned": true,
          "industries": [
            "clinic",
            "cosmeticclinic",
            "gyoseishoshi",
            "juku",
            "lawyer",
            "lodging",
            "realestate",
            "restaurant",
            "salon",
            "shihoshoshi",
            "tax"
          ]
        },
        "富士宮市": {
          "name": "富士宮市",
          "scanned": false,
          "industries": []
        },
        "裾野市": {
          "name": "裾野市",
          "scanned": false,
          "industries": []
        },
        "長泉町": {
          "name": "長泉町",
          "scanned": false,
          "industries": []
        },
        "藤枝市": {
          "name": "藤枝市",
          "scanned": false,
          "industries": []
        },
        "島田市": {
          "name": "島田市",
          "scanned": false,
          "industries": []
        },
        "磐田市": {
          "name": "磐田市",
          "scanned": false,
          "industries": []
        },
        "掛川市": {
          "name": "掛川市",
          "scanned": false,
          "industries": []
        },
        "焼津市": {
          "name": "焼津市",
          "scanned": false,
          "industries": []
        }
      }
    },
    "愛知県": {
      "pref_slug": "aichi",
      "cities": {
        "名古屋市": {
          "name": "名古屋市",
          "scanned": false,
          "industries": []
        },
        "豊田市": {
          "name": "豊田市",
          "scanned": false,
          "industries": []
        },
        "岡崎市": {
          "name": "岡崎市",
          "scanned": false,
          "industries": []
        },
        "一宮市": {
          "name": "一宮市",
          "scanned": false,
          "industries": []
        },
        "豊橋市": {
          "name": "豊橋市",
          "scanned": false,
          "industries": []
        },
        "春日井市": {
          "name": "春日井市",
          "scanned": false,
          "industries": []
        },
        "安城市": {
          "name": "安城市",
          "scanned": false,
          "industries": []
        },
        "豊川市": {
          "name": "豊川市",
          "scanned": false,
          "industries": []
        },
        "西尾市": {
          "name": "西尾市",
          "scanned": false,
          "industries": []
        },
        "小牧市": {
          "name": "小牧市",
          "scanned": false,
          "industries": []
        },
        "刈谷市": {
          "name": "刈谷市",
          "scanned": false,
          "industries": []
        },
        "稲沢市": {
          "name": "稲沢市",
          "scanned": false,
          "industries": []
        },
        "東海市": {
          "name": "東海市",
          "scanned": false,
          "industries": []
        },
        "瀬戸市": {
          "name": "瀬戸市",
          "scanned": false,
          "industries": []
        },
        "知多市": {
          "name": "知多市",
          "scanned": false,
          "industries": []
        },
        "あま市": {
          "name": "あま市",
          "scanned": false,
          "industries": []
        },
        "尾張旭市": {
          "name": "尾張旭市",
          "scanned": false,
          "industries": []
        },
        "日進市": {
          "name": "日進市",
          "scanned": false,
          "industries": []
        }
      }
    },
    "三重県": {
      "pref_slug": "mie",
      "cities": {
        "津市": {
          "name": "津市",
          "scanned": false,
          "industries": []
        },
        "四日市市": {
          "name": "四日市市",
          "scanned": false,
          "industries": []
        },
        "鈴鹿市": {
          "name": "鈴鹿市",
          "scanned": false,
          "industries": []
        },
        "桑名市": {
          "name": "桑名市",
          "scanned": false,
          "industries": []
        },
        "松阪市": {
          "name": "松阪市",
          "scanned": false,
          "industries": []
        },
        "伊勢市": {
          "name": "伊勢市",
          "scanned": false,
          "industries": []
        },
        "伊賀市": {
          "name": "伊賀市",
          "scanned": false,
          "industries": []
        }
      }
    },
    "滋賀県": {
      "pref_slug": "shiga",
      "cities": {
        "大津市": {
          "name": "大津市",
          "scanned": false,
          "industries": []
        },
        "草津市": {
          "name": "草津市",
          "scanned": false,
          "industries": []
        },
        "彦根市": {
          "name": "彦根市",
          "scanned": false,
          "industries": []
        },
        "長浜市": {
          "name": "長浜市",
          "scanned": false,
          "industries": []
        },
        "東近江市": {
          "name": "東近江市",
          "scanned": false,
          "industries": []
        },
        "甲賀市": {
          "name": "甲賀市",
          "scanned": false,
          "industries": []
        }
      }
    },
    "京都府": {
      "pref_slug": "kyoto",
      "cities": {
        "京都市": {
          "name": "京都市",
          "scanned": false,
          "industries": []
        },
        "宇治市": {
          "name": "宇治市",
          "scanned": false,
          "industries": []
        },
        "福知山市": {
          "name": "福知山市",
          "scanned": false,
          "industries": []
        },
        "舞鶴市": {
          "name": "舞鶴市",
          "scanned": false,
          "industries": []
        }
      }
    },
    "大阪府": {
      "pref_slug": "osaka",
      "cities": {
        "大阪市": {
          "name": "大阪市",
          "scanned": false,
          "industries": []
        },
        "堺市": {
          "name": "堺市",
          "scanned": false,
          "industries": []
        },
        "東大阪市": {
          "name": "東大阪市",
          "scanned": false,
          "industries": []
        },
        "枚方市": {
          "name": "枚方市",
          "scanned": false,
          "industries": []
        },
        "吹田市": {
          "name": "吹田市",
          "scanned": false,
          "industries": []
        },
        "豊中市": {
          "name": "豊中市",
          "scanned": false,
          "industries": []
        },
        "高槻市": {
          "name": "高槻市",
          "scanned": false,
          "industries": []
        },
        "八尾市": {
          "name": "八尾市",
          "scanned": false,
          "industries": []
        },
        "茨木市": {
          "name": "茨木市",
          "scanned": false,
          "industries": []
        },
        "寝屋川市": {
          "name": "寝屋川市",
          "scanned": false,
          "industries": []
        },
        "松原市": {
          "name": "松原市",
          "scanned": false,
          "industries": []
        },
        "岸和田市": {
          "name": "岸和田市",
          "scanned": false,
          "industries": []
        },
        "和泉市": {
          "name": "和泉市",
          "scanned": false,
          "industries": []
        },
        "箕面市": {
          "name": "箕面市",
          "scanned": false,
          "industries": []
        },
        "池田市": {
          "name": "池田市",
          "scanned": false,
          "industries": []
        },
        "守口市": {
          "name": "守口市",
          "scanned": false,
          "industries": []
        },
        "大東市": {
          "name": "大東市",
          "scanned": false,
          "industries": []
        },
        "羽曳野市": {
          "name": "羽曳野市",
          "scanned": false,
          "industries": []
        },
        "泉佐野市": {
          "name": "泉佐野市",
          "scanned": false,
          "industries": []
        },
        "富田林市": {
          "name": "富田林市",
          "scanned": false,
          "industries": []
        },
        "河内長野市": {
          "name": "河内長野市",
          "scanned": false,
          "industries": []
        },
        "門真市": {
          "name": "門真市",
          "scanned": false,
          "industries": []
        },
        "柏原市": {
          "name": "柏原市",
          "scanned": false,
          "industries": []
        },
        "摂津市": {
          "name": "摂津市",
          "scanned": false,
          "industries": []
        }
      }
    },
    "兵庫県": {
      "pref_slug": "hyogo",
      "cities": {
        "神戸市": {
          "name": "神戸市",
          "scanned": false,
          "industries": []
        },
        "姫路市": {
          "name": "姫路市",
          "scanned": false,
          "industries": []
        },
        "西宮市": {
          "name": "西宮市",
          "scanned": false,
          "industries": []
        },
        "尼崎市": {
          "name": "尼崎市",
          "scanned": false,
          "industries": []
        },
        "明石市": {
          "name": "明石市",
          "scanned": false,
          "industries": []
        },
        "加古川市": {
          "name": "加古川市",
          "scanned": false,
          "industries": []
        },
        "宝塚市": {
          "name": "宝塚市",
          "scanned": false,
          "industries": []
        },
        "伊丹市": {
          "name": "伊丹市",
          "scanned": false,
          "industries": []
        },
        "川西市": {
          "name": "川西市",
          "scanned": false,
          "industries": []
        },
        "三田市": {
          "name": "三田市",
          "scanned": false,
          "industries": []
        },
        "芦屋市": {
          "name": "芦屋市",
          "scanned": false,
          "industries": []
        }
      }
    },
    "奈良県": {
      "pref_slug": "nara",
      "cities": {
        "奈良市": {
          "name": "奈良市",
          "scanned": false,
          "industries": []
        },
        "橿原市": {
          "name": "橿原市",
          "scanned": false,
          "industries": []
        },
        "生駒市": {
          "name": "生駒市",
          "scanned": false,
          "industries": []
        },
        "大和郡山市": {
          "name": "大和郡山市",
          "scanned": false,
          "industries": []
        },
        "大和高田市": {
          "name": "大和高田市",
          "scanned": false,
          "industries": []
        }
      }
    },
    "和歌山県": {
      "pref_slug": "wakayama",
      "cities": {
        "和歌山市": {
          "name": "和歌山市",
          "scanned": false,
          "industries": []
        },
        "田辺市": {
          "name": "田辺市",
          "scanned": false,
          "industries": []
        }
      }
    },
    "鳥取県": {
      "pref_slug": "tottori",
      "cities": {
        "鳥取市": {
          "name": "鳥取市",
          "scanned": false,
          "industries": []
        },
        "米子市": {
          "name": "米子市",
          "scanned": false,
          "industries": []
        }
      }
    },
    "島根県": {
      "pref_slug": "shimane",
      "cities": {
        "松江市": {
          "name": "松江市",
          "scanned": false,
          "industries": []
        },
        "出雲市": {
          "name": "出雲市",
          "scanned": false,
          "industries": []
        }
      }
    },
    "岡山県": {
      "pref_slug": "okayama",
      "cities": {
        "岡山市": {
          "name": "岡山市",
          "scanned": false,
          "industries": []
        },
        "倉敷市": {
          "name": "倉敷市",
          "scanned": false,
          "industries": []
        },
        "津山市": {
          "name": "津山市",
          "scanned": false,
          "industries": []
        }
      }
    },
    "広島県": {
      "pref_slug": "hiroshima",
      "cities": {
        "広島市": {
          "name": "広島市",
          "scanned": false,
          "industries": []
        },
        "福山市": {
          "name": "福山市",
          "scanned": false,
          "industries": []
        },
        "呉市": {
          "name": "呉市",
          "scanned": false,
          "industries": []
        },
        "東広島市": {
          "name": "東広島市",
          "scanned": false,
          "industries": []
        },
        "尾道市": {
          "name": "尾道市",
          "scanned": false,
          "industries": []
        }
      }
    },
    "山口県": {
      "pref_slug": "yamaguchi",
      "cities": {
        "下関市": {
          "name": "下関市",
          "scanned": false,
          "industries": []
        },
        "山口市": {
          "name": "山口市",
          "scanned": false,
          "industries": []
        },
        "宇部市": {
          "name": "宇部市",
          "scanned": false,
          "industries": []
        },
        "周南市": {
          "name": "周南市",
          "scanned": false,
          "industries": []
        },
        "岩国市": {
          "name": "岩国市",
          "scanned": false,
          "industries": []
        }
      }
    },
    "徳島県": {
      "pref_slug": "tokushima",
      "cities": {
        "徳島市": {
          "name": "徳島市",
          "scanned": false,
          "industries": []
        }
      }
    },
    "香川県": {
      "pref_slug": "kagawa",
      "cities": {
        "高松市": {
          "name": "高松市",
          "scanned": false,
          "industries": []
        },
        "丸亀市": {
          "name": "丸亀市",
          "scanned": false,
          "industries": []
        }
      }
    },
    "愛媛県": {
      "pref_slug": "ehime",
      "cities": {
        "松山市": {
          "name": "松山市",
          "scanned": false,
          "industries": []
        },
        "今治市": {
          "name": "今治市",
          "scanned": false,
          "industries": []
        },
        "新居浜市": {
          "name": "新居浜市",
          "scanned": false,
          "industries": []
        },
        "西条市": {
          "name": "西条市",
          "scanned": false,
          "industries": []
        }
      }
    },
    "高知県": {
      "pref_slug": "kochi",
      "cities": {
        "高知市": {
          "name": "高知市",
          "scanned": false,
          "industries": []
        }
      }
    },
    "福岡県": {
      "pref_slug": "fukuoka",
      "cities": {
        "福岡市": {
          "name": "福岡市",
          "scanned": false,
          "industries": []
        },
        "北九州市": {
          "name": "北九州市",
          "scanned": false,
          "industries": []
        },
        "久留米市": {
          "name": "久留米市",
          "scanned": false,
          "industries": []
        },
        "大牟田市": {
          "name": "大牟田市",
          "scanned": false,
          "industries": []
        },
        "春日市": {
          "name": "春日市",
          "scanned": false,
          "industries": []
        },
        "筑紫野市": {
          "name": "筑紫野市",
          "scanned": false,
          "industries": []
        },
        "飯塚市": {
          "name": "飯塚市",
          "scanned": false,
          "industries": []
        },
        "古賀市": {
          "name": "古賀市",
          "scanned": false,
          "industries": []
        },
        "大野城市": {
          "name": "大野城市",
          "scanned": false,
          "industries": []
        },
        "宗像市": {
          "name": "宗像市",
          "scanned": false,
          "industries": []
        }
      }
    },
    "佐賀県": {
      "pref_slug": "saga",
      "cities": {
        "佐賀市": {
          "name": "佐賀市",
          "scanned": false,
          "industries": []
        },
        "唐津市": {
          "name": "唐津市",
          "scanned": false,
          "industries": []
        }
      }
    },
    "長崎県": {
      "pref_slug": "nagasaki",
      "cities": {
        "長崎市": {
          "name": "長崎市",
          "scanned": false,
          "industries": []
        },
        "佐世保市": {
          "name": "佐世保市",
          "scanned": false,
          "industries": []
        },
        "諫早市": {
          "name": "諫早市",
          "scanned": false,
          "industries": []
        }
      }
    },
    "熊本県": {
      "pref_slug": "kumamoto",
      "cities": {
        "熊本市": {
          "name": "熊本市",
          "scanned": false,
          "industries": []
        },
        "八代市": {
          "name": "八代市",
          "scanned": false,
          "industries": []
        }
      }
    },
    "大分県": {
      "pref_slug": "oita",
      "cities": {
        "大分市": {
          "name": "大分市",
          "scanned": false,
          "industries": []
        },
        "別府市": {
          "name": "別府市",
          "scanned": false,
          "industries": []
        }
      }
    },
    "宮崎県": {
      "pref_slug": "miyazaki",
      "cities": {
        "宮崎市": {
          "name": "宮崎市",
          "scanned": false,
          "industries": []
        },
        "都城市": {
          "name": "都城市",
          "scanned": false,
          "industries": []
        },
        "延岡市": {
          "name": "延岡市",
          "scanned": false,
          "industries": []
        }
      }
    },
    "鹿児島県": {
      "pref_slug": "kagoshima",
      "cities": {
        "鹿児島市": {
          "name": "鹿児島市",
          "scanned": false,
          "industries": []
        },
        "霧島市": {
          "name": "霧島市",
          "scanned": false,
          "industries": []
        },
        "鹿屋市": {
          "name": "鹿屋市",
          "scanned": false,
          "industries": []
        }
      }
    },
    "沖縄県": {
      "pref_slug": "okinawa",
      "cities": {
        "那覇市": {
          "name": "那覇市",
          "scanned": false,
          "industries": []
        },
        "沖縄市": {
          "name": "沖縄市",
          "scanned": false,
          "industries": []
        },
        "うるま市": {
          "name": "うるま市",
          "scanned": false,
          "industries": []
        },
        "浦添市": {
          "name": "浦添市",
          "scanned": false,
          "industries": []
        },
        "宜野湾市": {
          "name": "宜野湾市",
          "scanned": false,
          "industries": []
        }
      }
    }
  };

  function clearOptions(select, placeholderText) {
    while (select.firstChild) select.removeChild(select.firstChild);
    var opt = document.createElement('option');
    opt.value = '';
    opt.textContent = placeholderText;
    select.appendChild(opt);
  }

  function init() {
    var prefSel = document.getElementById('search-prefecture');
    var citySel = document.getElementById('search-city');
    var indSel  = document.getElementById('search-industry');
    var form    = document.getElementById('area-search-form');
    if (!prefSel || !citySel || !indSel || !form) return;

    // 1. 都道府県オプション初期化
    clearOptions(prefSel, '都道府県を選択');
    Object.keys(DATA).forEach(function(pref) {
      var opt = document.createElement('option');
      opt.value = pref;
      opt.textContent = pref;
      prefSel.appendChild(opt);
    });

    // 2. 都道府県変更 → 市町村絞り込み
    prefSel.addEventListener('change', function() {
      var pref = prefSel.value;
      clearOptions(citySel, '市町村を選択');
      clearOptions(indSel, '業種を選択（任意）');
      citySel.disabled = !pref;
      indSel.disabled = true;
      if (!pref) return;
      var cities = DATA[pref].cities;
      Object.keys(cities).forEach(function(slug) {
        var opt = document.createElement('option');
        opt.value = slug;
        opt.textContent = cities[slug].name + (cities[slug].scanned ? '' : '（業種データ準備中）');
        citySel.appendChild(opt);
      });
    });

    // 3. 市町村変更 → 業種絞り込み
    // 全 13 業種は常に選択可能（scanned 都市のみ実測ページへ遷移、非 scanned は都道府県ハブへ）
    var ALL_IND_SLUGS = Object.keys(IND_NAMES);
    citySel.addEventListener('change', function() {
      var pref = prefSel.value;
      var city = citySel.value;
      clearOptions(indSel, '業種を選択（任意）');
      indSel.disabled = !city;
      if (!city) return;
      var cityData = DATA[pref].cities[city];
      // scanned 都市は実測ありの業種を優先表示、それ以外も選択可
      var primary = (cityData && cityData.scanned) ? cityData.industries : [];
      var rest = ALL_IND_SLUGS.filter(function(s) { return primary.indexOf(s) === -1; });
      primary.forEach(function(slug) {
        var opt = document.createElement('option');
        opt.value = slug;
        opt.textContent = IND_NAMES[slug] + '（実測データあり）';
        indSel.appendChild(opt);
      });
      rest.forEach(function(slug) {
        var opt = document.createElement('option');
        opt.value = slug;
        opt.textContent = IND_NAMES[slug] || slug;
        indSel.appendChild(opt);
      });
    });

    // 4. 送信 → 該当 URL へ遷移
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      var pref = prefSel.value;
      var city = citySel.value;
      var ind  = indSel.value;
      var url = '/areas/';
      if (pref && city) {
        var cityData = DATA[pref].cities[city];
        if (cityData && cityData.scanned) {
          // scanned: city は romanized slug
          if (ind) {
            url = '/areas/' + city + '/' + ind + '/';
          } else {
            url = '/areas/' + city + '/';
          }
        } else {
          // 非 scanned: 都道府県ハブへ
          url = '/areas/pref/' + DATA[pref].pref_slug + '/';
        }
      } else if (pref) {
        url = '/areas/pref/' + DATA[pref].pref_slug + '/';
      }
      window.location.href = url;
    });

    // 初期状態：市町村 / 業種は disabled
    citySel.disabled = true;
    indSel.disabled = true;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
