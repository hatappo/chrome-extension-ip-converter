
# IPv4サポート追加

## 要件

- IPv6 だけでなく IPv4 にも対応させます。
  - IPv4 用の新たな入力フォームや UI を足すというよりも、極力現在の UI で IPv4 も扱うようにさせたいです。
  - 例えば、ipv4の場合の Binary 表示は4行のまま最初の1行だけに値が入ります。
  - popup の入力フォームは入力された値が ipv6 として解釈できれば ipv6 として扱い、ipv4 として解釈できれば ipv4 として扱います。どちらでもなければエラーメッセージです。
  - 規表現パターンはipRegexパッケージから持ってきてください。 https://github.com/sindresorhus/ip-regex を参考に。
- その他考慮漏れがあれば質問してください。
