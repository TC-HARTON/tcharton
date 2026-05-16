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
          "slug": "sapporo",
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
        "hakodate": {
          "name": "函館市",
          "scanned": false,
          "slug": "hakodate",
          "industries": []
        },
        "otaru": {
          "name": "小樽市",
          "scanned": false,
          "slug": "otaru",
          "industries": []
        },
        "asahikawa": {
          "name": "旭川市",
          "scanned": false,
          "slug": "asahikawa",
          "industries": []
        },
        "muroran": {
          "name": "室蘭市",
          "scanned": false,
          "slug": "muroran",
          "industries": []
        },
        "kushiro": {
          "name": "釧路市",
          "scanned": false,
          "slug": "kushiro",
          "industries": []
        },
        "obihiro": {
          "name": "帯広市",
          "scanned": false,
          "slug": "obihiro",
          "industries": []
        },
        "kitami": {
          "name": "北見市",
          "scanned": false,
          "slug": "kitami",
          "industries": []
        },
        "tomakomai": {
          "name": "苫小牧市",
          "scanned": false,
          "slug": "tomakomai",
          "industries": []
        },
        "ebetsu": {
          "name": "江別市",
          "scanned": false,
          "slug": "ebetsu",
          "industries": []
        },
        "chitose": {
          "name": "千歳市",
          "scanned": false,
          "slug": "chitose",
          "industries": []
        }
      }
    },
    "青森県": {
      "pref_slug": "aomori",
      "cities": {
        "aomori": {
          "name": "青森市",
          "scanned": false,
          "slug": "aomori",
          "industries": []
        },
        "hirosaki": {
          "name": "弘前市",
          "scanned": false,
          "slug": "hirosaki",
          "industries": []
        },
        "hachinohe": {
          "name": "八戸市",
          "scanned": false,
          "slug": "hachinohe",
          "industries": []
        }
      }
    },
    "岩手県": {
      "pref_slug": "iwate",
      "cities": {
        "morioka": {
          "name": "盛岡市",
          "scanned": false,
          "slug": "morioka",
          "industries": []
        },
        "oshu": {
          "name": "奥州市",
          "scanned": false,
          "slug": "oshu",
          "industries": []
        },
        "ichinoseki": {
          "name": "一関市",
          "scanned": false,
          "slug": "ichinoseki",
          "industries": []
        }
      }
    },
    "宮城県": {
      "pref_slug": "miyagi",
      "cities": {
        "sendai": {
          "name": "仙台市",
          "scanned": false,
          "slug": "sendai",
          "industries": []
        },
        "ishinomaki": {
          "name": "石巻市",
          "scanned": false,
          "slug": "ishinomaki",
          "industries": []
        }
      }
    },
    "秋田県": {
      "pref_slug": "akita",
      "cities": {
        "akita": {
          "name": "秋田市",
          "scanned": false,
          "slug": "akita",
          "industries": []
        },
        "yokote": {
          "name": "横手市",
          "scanned": false,
          "slug": "yokote",
          "industries": []
        },
        "daisen": {
          "name": "大仙市",
          "scanned": false,
          "slug": "daisen",
          "industries": []
        }
      }
    },
    "山形県": {
      "pref_slug": "yamagata",
      "cities": {
        "yamagata": {
          "name": "山形市",
          "scanned": false,
          "slug": "yamagata",
          "industries": []
        },
        "sakata": {
          "name": "酒田市",
          "scanned": false,
          "slug": "sakata",
          "industries": []
        },
        "tsuruoka": {
          "name": "鶴岡市",
          "scanned": false,
          "slug": "tsuruoka",
          "industries": []
        },
        "yonezawa": {
          "name": "米沢市",
          "scanned": false,
          "slug": "yonezawa",
          "industries": []
        }
      }
    },
    "福島県": {
      "pref_slug": "fukushima",
      "cities": {
        "fukushima": {
          "name": "福島市",
          "scanned": false,
          "slug": "fukushima",
          "industries": []
        },
        "koriyama": {
          "name": "郡山市",
          "scanned": false,
          "slug": "koriyama",
          "industries": []
        },
        "iwaki": {
          "name": "いわき市",
          "scanned": false,
          "slug": "iwaki",
          "industries": []
        },
        "aizuwakamatsu": {
          "name": "会津若松市",
          "scanned": false,
          "slug": "aizuwakamatsu",
          "industries": []
        }
      }
    },
    "茨城県": {
      "pref_slug": "ibaraki",
      "cities": {
        "mito": {
          "name": "水戸市",
          "scanned": false,
          "slug": "mito",
          "industries": []
        },
        "tsukuba": {
          "name": "つくば市",
          "scanned": false,
          "slug": "tsukuba",
          "industries": []
        },
        "hitachi": {
          "name": "日立市",
          "scanned": false,
          "slug": "hitachi",
          "industries": []
        },
        "hitachinaka": {
          "name": "ひたちなか市",
          "scanned": false,
          "slug": "hitachinaka",
          "industries": []
        },
        "tsuchiura": {
          "name": "土浦市",
          "scanned": false,
          "slug": "tsuchiura",
          "industries": []
        },
        "koga": {
          "name": "古河市",
          "scanned": false,
          "slug": "koga",
          "industries": []
        }
      }
    },
    "栃木県": {
      "pref_slug": "tochigi",
      "cities": {
        "utsunomiya": {
          "name": "宇都宮市",
          "scanned": false,
          "slug": "utsunomiya",
          "industries": []
        },
        "oyama": {
          "name": "小山市",
          "scanned": false,
          "slug": "oyama",
          "industries": []
        },
        "ashikaga": {
          "name": "足利市",
          "scanned": false,
          "slug": "ashikaga",
          "industries": []
        },
        "tochigi": {
          "name": "栃木市",
          "scanned": false,
          "slug": "tochigi",
          "industries": []
        }
      }
    },
    "群馬県": {
      "pref_slug": "gunma",
      "cities": {
        "maebashi": {
          "name": "前橋市",
          "scanned": false,
          "slug": "maebashi",
          "industries": []
        },
        "takasaki": {
          "name": "高崎市",
          "scanned": false,
          "slug": "takasaki",
          "industries": []
        },
        "isesaki": {
          "name": "伊勢崎市",
          "scanned": false,
          "slug": "isesaki",
          "industries": []
        },
        "ota-gunma": {
          "name": "太田市",
          "scanned": false,
          "slug": "ota-gunma",
          "industries": []
        }
      }
    },
    "埼玉県": {
      "pref_slug": "saitama",
      "cities": {
        "saitama": {
          "name": "さいたま市",
          "scanned": false,
          "slug": "saitama",
          "industries": []
        },
        "kawaguchi": {
          "name": "川口市",
          "scanned": false,
          "slug": "kawaguchi",
          "industries": []
        },
        "kawagoe": {
          "name": "川越市",
          "scanned": false,
          "slug": "kawagoe",
          "industries": []
        },
        "tokorozawa": {
          "name": "所沢市",
          "scanned": false,
          "slug": "tokorozawa",
          "industries": []
        },
        "koshigaya": {
          "name": "越谷市",
          "scanned": false,
          "slug": "koshigaya",
          "industries": []
        },
        "soka": {
          "name": "草加市",
          "scanned": false,
          "slug": "soka",
          "industries": []
        },
        "kasukabe": {
          "name": "春日部市",
          "scanned": false,
          "slug": "kasukabe",
          "industries": []
        },
        "ageo": {
          "name": "上尾市",
          "scanned": false,
          "slug": "ageo",
          "industries": []
        },
        "kumagaya": {
          "name": "熊谷市",
          "scanned": false,
          "slug": "kumagaya",
          "industries": []
        },
        "niiza": {
          "name": "新座市",
          "scanned": false,
          "slug": "niiza",
          "industries": []
        },
        "sayama": {
          "name": "狭山市",
          "scanned": false,
          "slug": "sayama",
          "industries": []
        },
        "iruma": {
          "name": "入間市",
          "scanned": false,
          "slug": "iruma",
          "industries": []
        },
        "asaka": {
          "name": "朝霞市",
          "scanned": false,
          "slug": "asaka",
          "industries": []
        },
        "toda": {
          "name": "戸田市",
          "scanned": false,
          "slug": "toda",
          "industries": []
        },
        "misato-saitama": {
          "name": "三郷市",
          "scanned": false,
          "slug": "misato-saitama",
          "industries": []
        },
        "yashio": {
          "name": "八潮市",
          "scanned": false,
          "slug": "yashio",
          "industries": []
        },
        "shiki": {
          "name": "志木市",
          "scanned": false,
          "slug": "shiki",
          "industries": []
        },
        "wako": {
          "name": "和光市",
          "scanned": false,
          "slug": "wako",
          "industries": []
        },
        "fujimi": {
          "name": "富士見市",
          "scanned": false,
          "slug": "fujimi",
          "industries": []
        },
        "okegawa": {
          "name": "桶川市",
          "scanned": false,
          "slug": "okegawa",
          "industries": []
        },
        "higashimatsuyama": {
          "name": "東松山市",
          "scanned": false,
          "slug": "higashimatsuyama",
          "industries": []
        },
        "sakado": {
          "name": "坂戸市",
          "scanned": false,
          "slug": "sakado",
          "industries": []
        },
        "fukaya": {
          "name": "深谷市",
          "scanned": false,
          "slug": "fukaya",
          "industries": []
        }
      }
    },
    "千葉県": {
      "pref_slug": "chiba",
      "cities": {
        "chiba": {
          "name": "千葉市",
          "scanned": false,
          "slug": "chiba",
          "industries": []
        },
        "funabashi": {
          "name": "船橋市",
          "scanned": false,
          "slug": "funabashi",
          "industries": []
        },
        "matsudo": {
          "name": "松戸市",
          "scanned": false,
          "slug": "matsudo",
          "industries": []
        },
        "ichikawa": {
          "name": "市川市",
          "scanned": false,
          "slug": "ichikawa",
          "industries": []
        },
        "kashiwa": {
          "name": "柏市",
          "scanned": false,
          "slug": "kashiwa",
          "industries": []
        },
        "ichihara": {
          "name": "市原市",
          "scanned": false,
          "slug": "ichihara",
          "industries": []
        },
        "yachiyo": {
          "name": "八千代市",
          "scanned": false,
          "slug": "yachiyo",
          "industries": []
        },
        "nagareyama": {
          "name": "流山市",
          "scanned": false,
          "slug": "nagareyama",
          "industries": []
        },
        "sakura": {
          "name": "佐倉市",
          "scanned": false,
          "slug": "sakura",
          "industries": []
        },
        "mobara": {
          "name": "茂原市",
          "scanned": false,
          "slug": "mobara",
          "industries": []
        },
        "narita": {
          "name": "成田市",
          "scanned": false,
          "slug": "narita",
          "industries": []
        },
        "narashino": {
          "name": "習志野市",
          "scanned": false,
          "slug": "narashino",
          "industries": []
        },
        "urayasu": {
          "name": "浦安市",
          "scanned": false,
          "slug": "urayasu",
          "industries": []
        },
        "abiko": {
          "name": "我孫子市",
          "scanned": false,
          "slug": "abiko",
          "industries": []
        },
        "kisarazu": {
          "name": "木更津市",
          "scanned": false,
          "slug": "kisarazu",
          "industries": []
        },
        "inzai": {
          "name": "印西市",
          "scanned": false,
          "slug": "inzai",
          "industries": []
        },
        "noda": {
          "name": "野田市",
          "scanned": false,
          "slug": "noda",
          "industries": []
        }
      }
    },
    "東京都": {
      "pref_slug": "tokyo",
      "cities": {
        "setagaya": {
          "name": "世田谷区",
          "scanned": false,
          "slug": "setagaya",
          "industries": []
        },
        "nerima": {
          "name": "練馬区",
          "scanned": false,
          "slug": "nerima",
          "industries": []
        },
        "ota-tokyo": {
          "name": "大田区",
          "scanned": false,
          "slug": "ota-tokyo",
          "industries": []
        },
        "edogawa": {
          "name": "江戸川区",
          "scanned": false,
          "slug": "edogawa",
          "industries": []
        },
        "adachi": {
          "name": "足立区",
          "scanned": false,
          "slug": "adachi",
          "industries": []
        },
        "suginami": {
          "name": "杉並区",
          "scanned": false,
          "slug": "suginami",
          "industries": []
        },
        "itabashi": {
          "name": "板橋区",
          "scanned": false,
          "slug": "itabashi",
          "industries": []
        },
        "koto": {
          "name": "江東区",
          "scanned": false,
          "slug": "koto",
          "industries": []
        },
        "katsushika": {
          "name": "葛飾区",
          "scanned": false,
          "slug": "katsushika",
          "industries": []
        },
        "shinagawa": {
          "name": "品川区",
          "scanned": false,
          "slug": "shinagawa",
          "industries": []
        },
        "kita-tokyo": {
          "name": "北区",
          "scanned": false,
          "slug": "kita-tokyo",
          "industries": []
        },
        "shinjuku": {
          "name": "新宿区",
          "scanned": false,
          "slug": "shinjuku",
          "industries": []
        },
        "nakano": {
          "name": "中野区",
          "scanned": false,
          "slug": "nakano",
          "industries": []
        },
        "toshima": {
          "name": "豊島区",
          "scanned": false,
          "slug": "toshima",
          "industries": []
        },
        "meguro": {
          "name": "目黒区",
          "scanned": false,
          "slug": "meguro",
          "industries": []
        },
        "shibuya": {
          "name": "渋谷区",
          "scanned": true,
          "slug": "shibuya",
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
        "minato": {
          "name": "港区",
          "scanned": false,
          "slug": "minato",
          "industries": []
        },
        "sumida": {
          "name": "墨田区",
          "scanned": false,
          "slug": "sumida",
          "industries": []
        },
        "taito": {
          "name": "台東区",
          "scanned": false,
          "slug": "taito",
          "industries": []
        },
        "bunkyo": {
          "name": "文京区",
          "scanned": false,
          "slug": "bunkyo",
          "industries": []
        },
        "chiyoda": {
          "name": "千代田区",
          "scanned": false,
          "slug": "chiyoda",
          "industries": []
        },
        "chuo-tokyo": {
          "name": "中央区",
          "scanned": false,
          "slug": "chuo-tokyo",
          "industries": []
        },
        "arakawa": {
          "name": "荒川区",
          "scanned": false,
          "slug": "arakawa",
          "industries": []
        },
        "hachioji": {
          "name": "八王子市",
          "scanned": false,
          "slug": "hachioji",
          "industries": []
        },
        "machida": {
          "name": "町田市",
          "scanned": false,
          "slug": "machida",
          "industries": []
        },
        "fuchu": {
          "name": "府中市",
          "scanned": false,
          "slug": "fuchu",
          "industries": []
        },
        "chofu": {
          "name": "調布市",
          "scanned": false,
          "slug": "chofu",
          "industries": []
        },
        "nishitokyo": {
          "name": "西東京市",
          "scanned": false,
          "slug": "nishitokyo",
          "industries": []
        },
        "kodaira": {
          "name": "小平市",
          "scanned": false,
          "slug": "kodaira",
          "industries": []
        },
        "musashino": {
          "name": "武蔵野市",
          "scanned": false,
          "slug": "musashino",
          "industries": []
        },
        "mitaka": {
          "name": "三鷹市",
          "scanned": false,
          "slug": "mitaka",
          "industries": []
        },
        "hino": {
          "name": "日野市",
          "scanned": false,
          "slug": "hino",
          "industries": []
        },
        "tachikawa": {
          "name": "立川市",
          "scanned": false,
          "slug": "tachikawa",
          "industries": []
        },
        "higashimurayama": {
          "name": "東村山市",
          "scanned": false,
          "slug": "higashimurayama",
          "industries": []
        },
        "tama": {
          "name": "多摩市",
          "scanned": false,
          "slug": "tama",
          "industries": []
        },
        "kokubunji": {
          "name": "国分寺市",
          "scanned": false,
          "slug": "kokubunji",
          "industries": []
        },
        "koganei": {
          "name": "小金井市",
          "scanned": false,
          "slug": "koganei",
          "industries": []
        },
        "higashikurume": {
          "name": "東久留米市",
          "scanned": false,
          "slug": "higashikurume",
          "industries": []
        },
        "ome": {
          "name": "青梅市",
          "scanned": false,
          "slug": "ome",
          "industries": []
        },
        "akishima": {
          "name": "昭島市",
          "scanned": false,
          "slug": "akishima",
          "industries": []
        },
        "komae": {
          "name": "狛江市",
          "scanned": false,
          "slug": "komae",
          "industries": []
        },
        "higashiyamato": {
          "name": "東大和市",
          "scanned": false,
          "slug": "higashiyamato",
          "industries": []
        }
      }
    },
    "神奈川県": {
      "pref_slug": "kanagawa",
      "cities": {
        "yokohama": {
          "name": "横浜市",
          "scanned": false,
          "slug": "yokohama",
          "industries": []
        },
        "kawasaki": {
          "name": "川崎市",
          "scanned": false,
          "slug": "kawasaki",
          "industries": []
        },
        "sagamihara": {
          "name": "相模原市",
          "scanned": false,
          "slug": "sagamihara",
          "industries": []
        },
        "fujisawa": {
          "name": "藤沢市",
          "scanned": false,
          "slug": "fujisawa",
          "industries": []
        },
        "yokosuka": {
          "name": "横須賀市",
          "scanned": false,
          "slug": "yokosuka",
          "industries": []
        },
        "hiratsuka": {
          "name": "平塚市",
          "scanned": false,
          "slug": "hiratsuka",
          "industries": []
        },
        "chigasaki": {
          "name": "茅ヶ崎市",
          "scanned": false,
          "slug": "chigasaki",
          "industries": []
        },
        "atsugi": {
          "name": "厚木市",
          "scanned": false,
          "slug": "atsugi",
          "industries": []
        },
        "yamato": {
          "name": "大和市",
          "scanned": false,
          "slug": "yamato",
          "industries": []
        },
        "odawara": {
          "name": "小田原市",
          "scanned": false,
          "slug": "odawara",
          "industries": []
        },
        "kamakura": {
          "name": "鎌倉市",
          "scanned": false,
          "slug": "kamakura",
          "industries": []
        },
        "hadano": {
          "name": "秦野市",
          "scanned": false,
          "slug": "hadano",
          "industries": []
        },
        "ebina": {
          "name": "海老名市",
          "scanned": false,
          "slug": "ebina",
          "industries": []
        },
        "zama": {
          "name": "座間市",
          "scanned": false,
          "slug": "zama",
          "industries": []
        },
        "isehara": {
          "name": "伊勢原市",
          "scanned": false,
          "slug": "isehara",
          "industries": []
        }
      }
    },
    "新潟県": {
      "pref_slug": "niigata",
      "cities": {
        "niigata": {
          "name": "新潟市",
          "scanned": false,
          "slug": "niigata",
          "industries": []
        },
        "nagaoka": {
          "name": "長岡市",
          "scanned": false,
          "slug": "nagaoka",
          "industries": []
        },
        "joetsu": {
          "name": "上越市",
          "scanned": false,
          "slug": "joetsu",
          "industries": []
        }
      }
    },
    "富山県": {
      "pref_slug": "toyama",
      "cities": {
        "toyama": {
          "name": "富山市",
          "scanned": false,
          "slug": "toyama",
          "industries": []
        },
        "takaoka": {
          "name": "高岡市",
          "scanned": false,
          "slug": "takaoka",
          "industries": []
        }
      }
    },
    "石川県": {
      "pref_slug": "ishikawa",
      "cities": {
        "kanazawa": {
          "name": "金沢市",
          "scanned": false,
          "slug": "kanazawa",
          "industries": []
        },
        "komatsu": {
          "name": "小松市",
          "scanned": false,
          "slug": "komatsu",
          "industries": []
        },
        "hakusan": {
          "name": "白山市",
          "scanned": false,
          "slug": "hakusan",
          "industries": []
        }
      }
    },
    "福井県": {
      "pref_slug": "fukui",
      "cities": {
        "fukui": {
          "name": "福井市",
          "scanned": false,
          "slug": "fukui",
          "industries": []
        }
      }
    },
    "山梨県": {
      "pref_slug": "yamanashi",
      "cities": {
        "kofu": {
          "name": "甲府市",
          "scanned": false,
          "slug": "kofu",
          "industries": []
        },
        "kai": {
          "name": "甲斐市",
          "scanned": false,
          "slug": "kai",
          "industries": []
        }
      }
    },
    "長野県": {
      "pref_slug": "nagano",
      "cities": {
        "nagano": {
          "name": "長野市",
          "scanned": false,
          "slug": "nagano",
          "industries": []
        },
        "matsumoto": {
          "name": "松本市",
          "scanned": false,
          "slug": "matsumoto",
          "industries": []
        },
        "ueda": {
          "name": "上田市",
          "scanned": false,
          "slug": "ueda",
          "industries": []
        },
        "iida": {
          "name": "飯田市",
          "scanned": false,
          "slug": "iida",
          "industries": []
        }
      }
    },
    "岐阜県": {
      "pref_slug": "gifu",
      "cities": {
        "gifu": {
          "name": "岐阜市",
          "scanned": false,
          "slug": "gifu",
          "industries": []
        },
        "ogaki": {
          "name": "大垣市",
          "scanned": false,
          "slug": "ogaki",
          "industries": []
        },
        "kakamigahara": {
          "name": "各務原市",
          "scanned": false,
          "slug": "kakamigahara",
          "industries": []
        },
        "tajimi": {
          "name": "多治見市",
          "scanned": false,
          "slug": "tajimi",
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
          "slug": "shizuoka",
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
          "slug": "hamamatsu",
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
          "slug": "numazu",
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
          "slug": "mishima",
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
          "slug": "fuji",
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
        "fujinomiya": {
          "name": "富士宮市",
          "scanned": false,
          "slug": "fujinomiya",
          "industries": []
        },
        "susono": {
          "name": "裾野市",
          "scanned": false,
          "slug": "susono",
          "industries": []
        },
        "nagaizumi": {
          "name": "長泉町",
          "scanned": false,
          "slug": "nagaizumi",
          "industries": []
        },
        "fujieda": {
          "name": "藤枝市",
          "scanned": false,
          "slug": "fujieda",
          "industries": []
        },
        "shimada": {
          "name": "島田市",
          "scanned": false,
          "slug": "shimada",
          "industries": []
        },
        "iwata": {
          "name": "磐田市",
          "scanned": false,
          "slug": "iwata",
          "industries": []
        },
        "kakegawa": {
          "name": "掛川市",
          "scanned": false,
          "slug": "kakegawa",
          "industries": []
        },
        "yaizu": {
          "name": "焼津市",
          "scanned": false,
          "slug": "yaizu",
          "industries": []
        }
      }
    },
    "愛知県": {
      "pref_slug": "aichi",
      "cities": {
        "nagoya": {
          "name": "名古屋市",
          "scanned": false,
          "slug": "nagoya",
          "industries": []
        },
        "toyota": {
          "name": "豊田市",
          "scanned": false,
          "slug": "toyota",
          "industries": []
        },
        "okazaki": {
          "name": "岡崎市",
          "scanned": false,
          "slug": "okazaki",
          "industries": []
        },
        "ichinomiya": {
          "name": "一宮市",
          "scanned": false,
          "slug": "ichinomiya",
          "industries": []
        },
        "toyohashi": {
          "name": "豊橋市",
          "scanned": false,
          "slug": "toyohashi",
          "industries": []
        },
        "kasugai": {
          "name": "春日井市",
          "scanned": false,
          "slug": "kasugai",
          "industries": []
        },
        "anjo": {
          "name": "安城市",
          "scanned": false,
          "slug": "anjo",
          "industries": []
        },
        "toyokawa": {
          "name": "豊川市",
          "scanned": false,
          "slug": "toyokawa",
          "industries": []
        },
        "nishio": {
          "name": "西尾市",
          "scanned": false,
          "slug": "nishio",
          "industries": []
        },
        "komaki": {
          "name": "小牧市",
          "scanned": false,
          "slug": "komaki",
          "industries": []
        },
        "kariya": {
          "name": "刈谷市",
          "scanned": false,
          "slug": "kariya",
          "industries": []
        },
        "inazawa": {
          "name": "稲沢市",
          "scanned": false,
          "slug": "inazawa",
          "industries": []
        },
        "tokai": {
          "name": "東海市",
          "scanned": false,
          "slug": "tokai",
          "industries": []
        },
        "seto": {
          "name": "瀬戸市",
          "scanned": false,
          "slug": "seto",
          "industries": []
        },
        "chita": {
          "name": "知多市",
          "scanned": false,
          "slug": "chita",
          "industries": []
        },
        "ama": {
          "name": "あま市",
          "scanned": false,
          "slug": "ama",
          "industries": []
        },
        "owariasahi": {
          "name": "尾張旭市",
          "scanned": false,
          "slug": "owariasahi",
          "industries": []
        },
        "nisshin": {
          "name": "日進市",
          "scanned": false,
          "slug": "nisshin",
          "industries": []
        }
      }
    },
    "三重県": {
      "pref_slug": "mie",
      "cities": {
        "tsu": {
          "name": "津市",
          "scanned": false,
          "slug": "tsu",
          "industries": []
        },
        "yokkaichi": {
          "name": "四日市市",
          "scanned": false,
          "slug": "yokkaichi",
          "industries": []
        },
        "suzuka": {
          "name": "鈴鹿市",
          "scanned": false,
          "slug": "suzuka",
          "industries": []
        },
        "kuwana": {
          "name": "桑名市",
          "scanned": false,
          "slug": "kuwana",
          "industries": []
        },
        "matsusaka": {
          "name": "松阪市",
          "scanned": false,
          "slug": "matsusaka",
          "industries": []
        },
        "ise": {
          "name": "伊勢市",
          "scanned": false,
          "slug": "ise",
          "industries": []
        },
        "iga": {
          "name": "伊賀市",
          "scanned": false,
          "slug": "iga",
          "industries": []
        }
      }
    },
    "滋賀県": {
      "pref_slug": "shiga",
      "cities": {
        "otsu": {
          "name": "大津市",
          "scanned": false,
          "slug": "otsu",
          "industries": []
        },
        "kusatsu": {
          "name": "草津市",
          "scanned": false,
          "slug": "kusatsu",
          "industries": []
        },
        "hikone": {
          "name": "彦根市",
          "scanned": false,
          "slug": "hikone",
          "industries": []
        },
        "nagahama": {
          "name": "長浜市",
          "scanned": false,
          "slug": "nagahama",
          "industries": []
        },
        "higashiomi": {
          "name": "東近江市",
          "scanned": false,
          "slug": "higashiomi",
          "industries": []
        },
        "koka": {
          "name": "甲賀市",
          "scanned": false,
          "slug": "koka",
          "industries": []
        }
      }
    },
    "京都府": {
      "pref_slug": "kyoto",
      "cities": {
        "kyoto": {
          "name": "京都市",
          "scanned": false,
          "slug": "kyoto",
          "industries": []
        },
        "uji": {
          "name": "宇治市",
          "scanned": false,
          "slug": "uji",
          "industries": []
        },
        "fukuchiyama": {
          "name": "福知山市",
          "scanned": false,
          "slug": "fukuchiyama",
          "industries": []
        },
        "maizuru": {
          "name": "舞鶴市",
          "scanned": false,
          "slug": "maizuru",
          "industries": []
        }
      }
    },
    "大阪府": {
      "pref_slug": "osaka",
      "cities": {
        "osaka": {
          "name": "大阪市",
          "scanned": false,
          "slug": "osaka",
          "industries": []
        },
        "sakai": {
          "name": "堺市",
          "scanned": false,
          "slug": "sakai",
          "industries": []
        },
        "higashiosaka": {
          "name": "東大阪市",
          "scanned": false,
          "slug": "higashiosaka",
          "industries": []
        },
        "hirakata": {
          "name": "枚方市",
          "scanned": false,
          "slug": "hirakata",
          "industries": []
        },
        "suita": {
          "name": "吹田市",
          "scanned": false,
          "slug": "suita",
          "industries": []
        },
        "toyonaka": {
          "name": "豊中市",
          "scanned": false,
          "slug": "toyonaka",
          "industries": []
        },
        "takatsuki": {
          "name": "高槻市",
          "scanned": false,
          "slug": "takatsuki",
          "industries": []
        },
        "yao": {
          "name": "八尾市",
          "scanned": false,
          "slug": "yao",
          "industries": []
        },
        "ibaraki": {
          "name": "茨木市",
          "scanned": false,
          "slug": "ibaraki",
          "industries": []
        },
        "neyagawa": {
          "name": "寝屋川市",
          "scanned": false,
          "slug": "neyagawa",
          "industries": []
        },
        "matsubara": {
          "name": "松原市",
          "scanned": false,
          "slug": "matsubara",
          "industries": []
        },
        "kishiwada": {
          "name": "岸和田市",
          "scanned": false,
          "slug": "kishiwada",
          "industries": []
        },
        "izumi": {
          "name": "和泉市",
          "scanned": false,
          "slug": "izumi",
          "industries": []
        },
        "minoh": {
          "name": "箕面市",
          "scanned": false,
          "slug": "minoh",
          "industries": []
        },
        "ikeda": {
          "name": "池田市",
          "scanned": false,
          "slug": "ikeda",
          "industries": []
        },
        "moriguchi": {
          "name": "守口市",
          "scanned": false,
          "slug": "moriguchi",
          "industries": []
        },
        "daito": {
          "name": "大東市",
          "scanned": false,
          "slug": "daito",
          "industries": []
        },
        "habikino": {
          "name": "羽曳野市",
          "scanned": false,
          "slug": "habikino",
          "industries": []
        },
        "izumisano": {
          "name": "泉佐野市",
          "scanned": false,
          "slug": "izumisano",
          "industries": []
        },
        "tondabayashi": {
          "name": "富田林市",
          "scanned": false,
          "slug": "tondabayashi",
          "industries": []
        },
        "kawachinagano": {
          "name": "河内長野市",
          "scanned": false,
          "slug": "kawachinagano",
          "industries": []
        },
        "kadoma": {
          "name": "門真市",
          "scanned": false,
          "slug": "kadoma",
          "industries": []
        },
        "kashiwara": {
          "name": "柏原市",
          "scanned": false,
          "slug": "kashiwara",
          "industries": []
        },
        "settsu": {
          "name": "摂津市",
          "scanned": false,
          "slug": "settsu",
          "industries": []
        }
      }
    },
    "兵庫県": {
      "pref_slug": "hyogo",
      "cities": {
        "kobe": {
          "name": "神戸市",
          "scanned": false,
          "slug": "kobe",
          "industries": []
        },
        "himeji": {
          "name": "姫路市",
          "scanned": false,
          "slug": "himeji",
          "industries": []
        },
        "nishinomiya": {
          "name": "西宮市",
          "scanned": false,
          "slug": "nishinomiya",
          "industries": []
        },
        "amagasaki": {
          "name": "尼崎市",
          "scanned": false,
          "slug": "amagasaki",
          "industries": []
        },
        "akashi": {
          "name": "明石市",
          "scanned": false,
          "slug": "akashi",
          "industries": []
        },
        "kakogawa": {
          "name": "加古川市",
          "scanned": false,
          "slug": "kakogawa",
          "industries": []
        },
        "takarazuka": {
          "name": "宝塚市",
          "scanned": false,
          "slug": "takarazuka",
          "industries": []
        },
        "itami": {
          "name": "伊丹市",
          "scanned": false,
          "slug": "itami",
          "industries": []
        },
        "kawanishi": {
          "name": "川西市",
          "scanned": false,
          "slug": "kawanishi",
          "industries": []
        },
        "sanda": {
          "name": "三田市",
          "scanned": false,
          "slug": "sanda",
          "industries": []
        },
        "ashiya": {
          "name": "芦屋市",
          "scanned": false,
          "slug": "ashiya",
          "industries": []
        }
      }
    },
    "奈良県": {
      "pref_slug": "nara",
      "cities": {
        "nara": {
          "name": "奈良市",
          "scanned": false,
          "slug": "nara",
          "industries": []
        },
        "kashihara": {
          "name": "橿原市",
          "scanned": false,
          "slug": "kashihara",
          "industries": []
        },
        "ikoma": {
          "name": "生駒市",
          "scanned": false,
          "slug": "ikoma",
          "industries": []
        },
        "yamatokoriyama": {
          "name": "大和郡山市",
          "scanned": false,
          "slug": "yamatokoriyama",
          "industries": []
        },
        "yamatotakada": {
          "name": "大和高田市",
          "scanned": false,
          "slug": "yamatotakada",
          "industries": []
        }
      }
    },
    "和歌山県": {
      "pref_slug": "wakayama",
      "cities": {
        "wakayama": {
          "name": "和歌山市",
          "scanned": false,
          "slug": "wakayama",
          "industries": []
        },
        "tanabe": {
          "name": "田辺市",
          "scanned": false,
          "slug": "tanabe",
          "industries": []
        }
      }
    },
    "鳥取県": {
      "pref_slug": "tottori",
      "cities": {
        "tottori": {
          "name": "鳥取市",
          "scanned": false,
          "slug": "tottori",
          "industries": []
        },
        "yonago": {
          "name": "米子市",
          "scanned": false,
          "slug": "yonago",
          "industries": []
        }
      }
    },
    "島根県": {
      "pref_slug": "shimane",
      "cities": {
        "matsue": {
          "name": "松江市",
          "scanned": false,
          "slug": "matsue",
          "industries": []
        },
        "izumo": {
          "name": "出雲市",
          "scanned": false,
          "slug": "izumo",
          "industries": []
        }
      }
    },
    "岡山県": {
      "pref_slug": "okayama",
      "cities": {
        "okayama": {
          "name": "岡山市",
          "scanned": false,
          "slug": "okayama",
          "industries": []
        },
        "kurashiki": {
          "name": "倉敷市",
          "scanned": false,
          "slug": "kurashiki",
          "industries": []
        },
        "tsuyama": {
          "name": "津山市",
          "scanned": false,
          "slug": "tsuyama",
          "industries": []
        }
      }
    },
    "広島県": {
      "pref_slug": "hiroshima",
      "cities": {
        "hiroshima": {
          "name": "広島市",
          "scanned": false,
          "slug": "hiroshima",
          "industries": []
        },
        "fukuyama": {
          "name": "福山市",
          "scanned": false,
          "slug": "fukuyama",
          "industries": []
        },
        "kure": {
          "name": "呉市",
          "scanned": false,
          "slug": "kure",
          "industries": []
        },
        "higashihiroshima": {
          "name": "東広島市",
          "scanned": false,
          "slug": "higashihiroshima",
          "industries": []
        },
        "onomichi": {
          "name": "尾道市",
          "scanned": false,
          "slug": "onomichi",
          "industries": []
        }
      }
    },
    "山口県": {
      "pref_slug": "yamaguchi",
      "cities": {
        "shimonoseki": {
          "name": "下関市",
          "scanned": false,
          "slug": "shimonoseki",
          "industries": []
        },
        "yamaguchi": {
          "name": "山口市",
          "scanned": false,
          "slug": "yamaguchi",
          "industries": []
        },
        "ube": {
          "name": "宇部市",
          "scanned": false,
          "slug": "ube",
          "industries": []
        },
        "shunan": {
          "name": "周南市",
          "scanned": false,
          "slug": "shunan",
          "industries": []
        },
        "iwakuni": {
          "name": "岩国市",
          "scanned": false,
          "slug": "iwakuni",
          "industries": []
        }
      }
    },
    "徳島県": {
      "pref_slug": "tokushima",
      "cities": {
        "tokushima": {
          "name": "徳島市",
          "scanned": false,
          "slug": "tokushima",
          "industries": []
        }
      }
    },
    "香川県": {
      "pref_slug": "kagawa",
      "cities": {
        "takamatsu": {
          "name": "高松市",
          "scanned": false,
          "slug": "takamatsu",
          "industries": []
        },
        "marugame": {
          "name": "丸亀市",
          "scanned": false,
          "slug": "marugame",
          "industries": []
        }
      }
    },
    "愛媛県": {
      "pref_slug": "ehime",
      "cities": {
        "matsuyama": {
          "name": "松山市",
          "scanned": false,
          "slug": "matsuyama",
          "industries": []
        },
        "imabari": {
          "name": "今治市",
          "scanned": false,
          "slug": "imabari",
          "industries": []
        },
        "niihama": {
          "name": "新居浜市",
          "scanned": false,
          "slug": "niihama",
          "industries": []
        },
        "saijo": {
          "name": "西条市",
          "scanned": false,
          "slug": "saijo",
          "industries": []
        }
      }
    },
    "高知県": {
      "pref_slug": "kochi",
      "cities": {
        "kochi": {
          "name": "高知市",
          "scanned": false,
          "slug": "kochi",
          "industries": []
        }
      }
    },
    "福岡県": {
      "pref_slug": "fukuoka",
      "cities": {
        "fukuoka": {
          "name": "福岡市",
          "scanned": false,
          "slug": "fukuoka",
          "industries": []
        },
        "kitakyushu": {
          "name": "北九州市",
          "scanned": false,
          "slug": "kitakyushu",
          "industries": []
        },
        "kurume": {
          "name": "久留米市",
          "scanned": false,
          "slug": "kurume",
          "industries": []
        },
        "omuta": {
          "name": "大牟田市",
          "scanned": false,
          "slug": "omuta",
          "industries": []
        },
        "kasuga": {
          "name": "春日市",
          "scanned": false,
          "slug": "kasuga",
          "industries": []
        },
        "chikushino": {
          "name": "筑紫野市",
          "scanned": false,
          "slug": "chikushino",
          "industries": []
        },
        "iizuka": {
          "name": "飯塚市",
          "scanned": false,
          "slug": "iizuka",
          "industries": []
        },
        "koga-fukuoka": {
          "name": "古賀市",
          "scanned": false,
          "slug": "koga-fukuoka",
          "industries": []
        },
        "onojo": {
          "name": "大野城市",
          "scanned": false,
          "slug": "onojo",
          "industries": []
        },
        "munakata": {
          "name": "宗像市",
          "scanned": false,
          "slug": "munakata",
          "industries": []
        }
      }
    },
    "佐賀県": {
      "pref_slug": "saga",
      "cities": {
        "saga": {
          "name": "佐賀市",
          "scanned": false,
          "slug": "saga",
          "industries": []
        },
        "karatsu": {
          "name": "唐津市",
          "scanned": false,
          "slug": "karatsu",
          "industries": []
        }
      }
    },
    "長崎県": {
      "pref_slug": "nagasaki",
      "cities": {
        "nagasaki": {
          "name": "長崎市",
          "scanned": false,
          "slug": "nagasaki",
          "industries": []
        },
        "sasebo": {
          "name": "佐世保市",
          "scanned": false,
          "slug": "sasebo",
          "industries": []
        },
        "isahaya": {
          "name": "諫早市",
          "scanned": false,
          "slug": "isahaya",
          "industries": []
        }
      }
    },
    "熊本県": {
      "pref_slug": "kumamoto",
      "cities": {
        "kumamoto": {
          "name": "熊本市",
          "scanned": false,
          "slug": "kumamoto",
          "industries": []
        },
        "yatsushiro": {
          "name": "八代市",
          "scanned": false,
          "slug": "yatsushiro",
          "industries": []
        }
      }
    },
    "大分県": {
      "pref_slug": "oita",
      "cities": {
        "oita": {
          "name": "大分市",
          "scanned": false,
          "slug": "oita",
          "industries": []
        },
        "beppu": {
          "name": "別府市",
          "scanned": false,
          "slug": "beppu",
          "industries": []
        }
      }
    },
    "宮崎県": {
      "pref_slug": "miyazaki",
      "cities": {
        "miyazaki": {
          "name": "宮崎市",
          "scanned": false,
          "slug": "miyazaki",
          "industries": []
        },
        "miyakonojo": {
          "name": "都城市",
          "scanned": false,
          "slug": "miyakonojo",
          "industries": []
        },
        "nobeoka": {
          "name": "延岡市",
          "scanned": false,
          "slug": "nobeoka",
          "industries": []
        }
      }
    },
    "鹿児島県": {
      "pref_slug": "kagoshima",
      "cities": {
        "kagoshima": {
          "name": "鹿児島市",
          "scanned": false,
          "slug": "kagoshima",
          "industries": []
        },
        "kirishima": {
          "name": "霧島市",
          "scanned": false,
          "slug": "kirishima",
          "industries": []
        },
        "kanoya": {
          "name": "鹿屋市",
          "scanned": false,
          "slug": "kanoya",
          "industries": []
        }
      }
    },
    "沖縄県": {
      "pref_slug": "okinawa",
      "cities": {
        "naha": {
          "name": "那覇市",
          "scanned": false,
          "slug": "naha",
          "industries": []
        },
        "okinawa-city": {
          "name": "沖縄市",
          "scanned": false,
          "slug": "okinawa-city",
          "industries": []
        },
        "uruma": {
          "name": "うるま市",
          "scanned": false,
          "slug": "uruma",
          "industries": []
        },
        "urasoe": {
          "name": "浦添市",
          "scanned": false,
          "slug": "urasoe",
          "industries": []
        },
        "ginowan": {
          "name": "宜野湾市",
          "scanned": false,
          "slug": "ginowan",
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
        if (cityData && cityData.scanned && ind) {
          // scanned + industry → /areas/{slug}/{industry}/
          url = '/areas/' + cityData.slug + '/' + ind + '/';
        } else if (cityData) {
          // 全都市: /areas/{slug}/ の個別 city hub へ
          url = '/areas/' + cityData.slug + '/';
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
