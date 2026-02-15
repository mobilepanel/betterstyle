(function () {
  "use strict";

  const jsColorPackage = `https://cdnjs.cloudflare.com/ajax/libs/jscolor/2.0.4/jscolor.min.js`;
  var localStorage;
  var nowSetting;
  var isLocal;
  var clone;
  var customThemes = [];
  const STORAGE_KEY = "betterstyle_v3_settings";
  const THEME_KEY = "betterstyle_Themes_v3_local";

  jsInit();

  setTimeout(pluginInit, 2000);

  function jsInit() {
    Storage.prototype.setObject = function (key, value) {
      this.setItem(key, JSON.stringify(value));
    };
    Storage.prototype.getObject = function (key) {
      var value = this.getItem(key);
      return value && JSON.parse(value);
    };
    clone = function (obj) {
      return JSON.parse(JSON.stringify(obj));
    };
    window.diepStyle = {};
    window.diepStyle.currentThemeId = null;
    localStorage = window.localStorage;
    if (location.href.indexOf("file://") >= 0) {
      isLocal = true;
    }
    var storedThemes = localStorage.getObject(THEME_KEY);
    if (storedThemes && Array.isArray(storedThemes)) {
      customThemes = storedThemes.map(t => t.id ? t : { ...t, id: Date.now() + Math.random() });
    }
  }

  function escapeHtml(text) {
    if (!text) return "";
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  function pluginInit() {
    storageInit();
    keyListen();
    tempInit();
    styleInit();
    diepStyle.onColor = onColor;
    diepStyle.storageInit = storageInit;

    function storageInit(cmd) {
      var th = 50,
        netTH = 110;
      var colors = [
        { id: 2, name: "You FFA", color: "00b1de" },
        { id: 15, name: "Other FFA", color: "f14e54" },
        { id: 3, name: "Blue Team", color: "00b1de" },
        { id: 4, name: "Red Team", color: "f14e54" },
        { id: 5, name: "Purple Team", color: "bf7ff5" },
        { id: 6, name: "Green Team", color: "00e16e" },
        { id: 17, name: "Fallen Team", color: "c6c6c6" },
        { id: 12, name: "Arena Closer", color: "ffe869" },
        { id: 8, name: "Square", color: "ffe869" },
        { id: 7, name: "Green Square", color: "89ff69" },
        { id: 16, name: "Necro Square", color: "fcc376" },
        { id: 9, name: "Triangle", color: "fc7677" },
        { id: 10, name: "Pentagon", color: "768dfc" },
        { id: 18, name: "Hexagon", color: "32c5db" },
        { id: 11, name: "Crasher", color: "f177dd" },
        { id: 14, name: "Maze Wall", color: "bbbbbb" },
        { id: 1, name: "Turret", color: "999999" },
        { id: 0, name: "Smasher", color: "4f4f4f" },
        // -- //
        { id: th++, name: "All Bars", color: "000000", cmd: "ren_bar_background_color" },
        { id: th++, name: "Outline", color: "555555", cmd: "ren_stroke_solid_color" },
        { id: 13, name: "Leader Board", color: "64ff8c" },
        { id: th++, name: "Xp Bar", color: "ffde43", cmd: "ren_xp_bar_fill_color" },
        { id: th++, name: "Score Bar", color: "43ff91", cmd: "ren_score_bar_fill_color" },
        { id: th++, name: "Health Bar1", color: "85e37d", cmd: "ren_health_fill_color" },
        { id: th++, name: "Health Bar2", color: "555555", cmd: "ren_health_background_color" },
        { id: th++, name: "Grid Color", color: "000000", cmd: "ren_grid_color" },
        { id: th++, name: "Minimap 1", color: "CDCDCD", cmd: "ren_minimap_background_color" },
        { id: th++, name: "Minimap 2", color: "797979", cmd: "ren_minimap_border_color" },
        { id: th++, name: "Background 1", color: "CDCDCD", cmd: "ren_background_color" },
        { id: th++, name: "Background 2", color: "797979", cmd: "ren_border_color" },
        // -- //
        { id: netTH++, name: "UI Color1", color: "e69f6c", cmd: "ui_replace_colors" },
        { id: netTH++, name: "UI Color2", color: "ff73ff", cmd: "ui_replace_colors" },
        { id: netTH++, name: "UI Color3", color: "c980ff", cmd: "ui_replace_colors" },
        { id: netTH++, name: "UI Color4", color: "71b4ff", cmd: "ui_replace_colors" },
        { id: netTH++, name: "UI Color5", color: "ffed3f", cmd: "ui_replace_colors" },
        { id: netTH++, name: "UI Color6", color: "ff7979", cmd: "ui_replace_colors" },
        { id: netTH++, name: "UI Color7", color: "88ff41", cmd: "ui_replace_colors" },
        { id: netTH++, name: "UI Color8", color: "41ffff", cmd: "ui_replace_colors" },
      ];
      diepStyle.colorMap = new Map(
        colors.map(function (elem) {
          return [
            elem.id,
            {
              color: elem.color,
              cmd: elem.cmd || "no cmd",
            },
          ];
        })
      );
      diepStyle.uiColorMap = function (cmd) {
        var uiTH = nowSetting.colors.findIndex(
          (elem) => elem.name == "UI Color1"
        );
        var colorBunch = "";
        var arr = [];
        if (cmd == "0x") {
          for (var i = 0; i < 8; i++) {
            colorBunch = " 0x" + nowSetting.colors[uiTH + i].color + colorBunch;
          }
          return colorBunch;
        }
        if (cmd == "array") {
          for (var i = 0; i < 8; i++) {
            arr.push(nowSetting.colors[uiTH + i].color);
          }
          return arr;
        }
      };
      var renders = [
        { name: "Grid Alpha", value: 0.1, cmd: "grid_base_alpha" },
        { name: "Outline Intensity", value: 0.25, cmd: "stroke_soft_color_intensity" },
        { name: "Show Outline", value: false, cmd: "stroke_soft_color", reverse: true },
        { name: "Border Alpha", value: 0.1, cmd: "border_color_alpha" },
        { name: "UI Scale", value: 1, cmd: "ui_scale" },
        { name: "Clear UI", value: false, cmd: "ui", reverse: true },
        { name: "Show FPS", value: false, cmd: "fps" },
        { name: "Show Health", value: false, cmd: "raw_health_values" },
        { name: "Hide Name", value: false, cmd: "names", reverse: true },
      ];
      (function checkHasStorage() {
        var _localStorage = localStorage.getObject(STORAGE_KEY);

        if (_localStorage && _localStorage.nowSetting) {
          nowSetting = _localStorage.nowSetting;
        }

        if (!nowSetting || cmd == "reset") {
          nowSetting = getBlankSetting();
        }

        var plain = getBlankSetting();
        plain.renders.forEach((elem, th) => {
          var index = nowSetting.renders.findIndex(
            (now) => elem.cmd == now.cmd
          );
          if (index < 0) {
            nowSetting.renders.splice(th, 0, elem);
          }
        });
        plain.colors.forEach((elem, th) => {
          var index = nowSetting.colors.findIndex((now) => {
            if (elem.cmd && elem.cmd == now.cmd) return true;
            if ((elem.id || elem.id == 0) && elem.id == now.id) return true;
          });
          if (index < 0) {
            nowSetting.colors.splice(th, 0, elem);
          }
        });
      })();
      (function command() {
        diepStyle.command = {};
        renders.forEach((elem) => {
          diepStyle.command[elem.cmd] = {};
          if (elem.reverse) diepStyle.command[elem.cmd].reverse = true;
        });
        diepStyle.command.fn = function (cmd, value) {
          nowSetting.renders = nowSetting.renders.map((elem) => {
            if (elem.cmd == cmd) elem.value = value;
            return elem;
          });
          if (diepStyle.command[cmd].reverse) value = !value;

          if (window.input) {
            window.input.set_convar("ren_" + cmd, value);
          }
        };
      })();
      function getBlankSetting() {
        return {
          version: 3.0,
          lock: false,
          colors: clone(colors),
          renders: clone(renders),
          uiMode: 'light'
        };
      }

      Storage.prototype.pluginSave = function () {
        var _storageObj = {
          nowSetting: clone(nowSetting),
        };
        localStorage.setObject(STORAGE_KEY, _storageObj);
      };
      localStorage.pluginSave();
    }

    function keyListen() {
      var input = "";
      var panelOn = false;
      const performToggle = () => {
        panelOn = !panelOn;
        togglePanel(panelOn);
        if (!panelOn) {
          localStorage.pluginSave();
        }
      };

      document.addEventListener("keyup", function (evt) {
        var e = window.event || evt;
        var key = e.which || e.keyCode;
        input += key;
        if (input.indexOf("2727") >= 0) {
          input = "";
          performToggle();
        }
        if (input.length > 10) input = input.substring(input.length - 10);
      });

      let tapCount = 0;
      let tapTimer = null;
      const handleAreaTrigger = (e) => {
        const x = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
        const y = e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : 0);
        const screenW = window.innerWidth;
        const screenH = window.innerHeight;

        if (x < screenW * 0.15 && y > screenH * 0.85) {
          tapCount++;
          clearTimeout(tapTimer);
          if (tapCount === 4) {
            tapCount = 0;
            performToggle();
          }
          tapTimer = setTimeout(() => { tapCount = 0; }, 600);
        } else {
          tapCount = 0;
        }
      };
      document.addEventListener("mousedown", handleAreaTrigger);
      document.addEventListener("touchstart", handleAreaTrigger, { passive: true });
    }

    function tempInit() {
      diepStyle.exportJSON = exportJSON;
      diepStyle.importJSON = importJSON;

      init1();
      loadColor();
      setTimeout(diepStyle.resetRender, 1500);
      diepStyle.resetColor = loadColor;

      function init1() {
        diepStyle.resetRender = resetRender;
        var title = `
            <div class="header-container">
                <div class="title">Better Style <small>v4.1</small></div>
                <div class="toggle-container">
                   <label class="switch">
                      <input type="checkbox" id="darkModeToggle">
                      <span class="slider round"></span>
                   </label>
                   <span class="toggle-label">Dark UI</span>
                </div>
            </div>
            <div class="subtitle">Press Esc twice to toggle</div>`;
        var colorPlane = function (id) {
          return `{position:'left',width:300, height:200,onFineChange:'diepStyle.onColor(${id},this)'}`;
        };

        window.updateOverwriteBtn = function() {
           const btn = document.getElementById('overwriteThemeBtn');
           if(btn) {
                btn.disabled = !diepStyle.currentThemeId || !customThemes.find(t => t.id === diepStyle.currentThemeId);
           }
        }

        // Custom Modal Logic (Alert/Confirm)
        window.customAlert = function(msg) {
             const m = document.getElementById('ds-msg-modal');
             const t = document.getElementById('ds-msg-text');
             const ok = document.getElementById('ds-msg-ok');
             const cancel = document.getElementById('ds-msg-cancel');
             const title = document.getElementById('ds-msg-title');

             title.innerText = "Notice";
             t.innerText = msg;
             m.classList.remove('hide');
             cancel.style.display = 'none';

             ok.onclick = function() {
                 m.classList.add('hide');
             }
        }

        window.customConfirm = function(msg, onYes) {
             const m = document.getElementById('ds-msg-modal');
             const t = document.getElementById('ds-msg-text');
             const ok = document.getElementById('ds-msg-ok');
             const cancel = document.getElementById('ds-msg-cancel');
             const title = document.getElementById('ds-msg-title');

             title.innerText = "Confirm";
             t.innerText = msg;
             m.classList.remove('hide');
             cancel.style.display = 'inline-block';

             ok.onclick = function() {
                 m.classList.add('hide');
                 if(onYes) onYes();
             }
             cancel.onclick = function() {
                 m.classList.add('hide');
             }
        }

        function resetRender(cmd) {
          document.querySelectorAll("#styleSetting .render").forEach(function (elem) {
              elem.outerHTML = ``;
          });
          var it = document.querySelector(".renderBegin");
          if(!it) return;

          it.insertAdjacentHTML("afterend", getRenderBody());

          nowSetting.renders.forEach(function (elem) {
            diepStyle.command.fn(elem.cmd, elem.value);
          });

          bindRenderListeners();

          const toggle = document.getElementById('darkModeToggle');
          if (nowSetting.uiMode === 'dark') {
            document.getElementById('styleSetting').classList.add('dark-mode');
            if (toggle) toggle.checked = true;
          } else {
            document.getElementById('styleSetting').classList.remove('dark-mode');
            if (toggle) toggle.checked = false;
          }
          updateOverwriteBtn();
        }

        var bodyTheme = getThemeBody();
        var bodyRender = getRenderBody();
        var bodyColor = getColorBody();

        function getThemeBody() {
          let themeListHTML = customThemes.map((t) => {
            return `
                <div class="theme-card" data-id="${t.id}">
                    <div class="theme-name" title="${escapeHtml(t.name)}">${escapeHtml(t.name)}</div>
                     <div class="theme-actions">
                        <button class="load-theme-btn" data-id="${t.id}">Load</button>
                        <button class="delete-theme-btn" data-id="${t.id}">×</button>
                    </div>
                </div>`;
          }).join('');
          var html = `
                <div class="themeBody">
                    <div class="section-title">Local Themes</div>
                    <div class="theme-controls">
                        <input type="text" id="newThemeName" placeholder="Theme Name">
                        <button id="saveThemeBtn" title="Save as new theme">Save New</button>
                        <button id="overwriteThemeBtn" title="Overwrite currently loaded theme" disabled>Overwrite</button>
                    </div>
                    <div class="theme-list" id="customThemeList">
                        ${themeListHTML || '<div class="no-themes">No local themes saved.</div>'}
                    </div>
                </div>
            `;
          return html;
        }

        function getRenderBody() {
          var renders = nowSetting.renders;
          var th = -1;

          const rangeRow = (name, cmd, val, max, unit = '') => {
            return `<div class="row render">
                <div class="cell label">${name}</div>
                <div class="cell value-display"><span class="${cmd}_value">${val}</span>${unit}</div>
                <div class="cell input-area">
                    <input type="range" name="${cmd}" value="${val * 100}" max="${max}">
                </div>
             </div>`;
          };
          const checkRow = (name, cmd, val) => {
            return `<div class="row render">
                <div class="cell label">${name}</div>
                <div class="cell input-area check-area">
                   <label class="switch">
                      <input type="checkbox" name="${cmd}" ${val ? "checked" : ""}>
                        <span class="slider round"></span>
                    </label>
                </div>
             </div>`;
          };

          var html = ``;
          html += rangeRow(renders[++th].name, "grid_base_alpha", renders[th].value, 200);
          html += rangeRow(renders[++th].name, "stroke_soft_color_intensity", renders[th].value, 100);
          html += checkRow(renders[++th].name, "stroke_soft_color", renders[th].value);
          html += rangeRow(renders[++th].name, "border_color_alpha", renders[th].value, 100);
          html += rangeRow(renders[++th].name, "ui_scale", renders[th].value, 200);
          html += checkRow(renders[++th].name, "ui", renders[th].value);
          html += checkRow(renders[++th].name, "fps", renders[th].value);
          html += checkRow(renders[++th].name, "raw_health_values", renders[th].value);
          html += checkRow(renders[++th].name, "names", renders[th].value);
          return html;
        }

        function getColorBody() {
          var it = `<div class="section-title">Colors</div><div class="color-grid">`;
          nowSetting.colors.forEach(function (elem, th) {
            var id = elem.id;
            it += `
                <div class="color-item colorBlock${th}">
                    <div class="color-label">${elem.name}</div>
                    <input class="jscolor ${colorPlane(`${id}`)}">
                 </div>
            `;
          });
          it += `</div>`;
          return it;
        }

        var allBody = `
            <div class="pluginBody">
                ${title}
                <hr>
                ${bodyTheme}
                <hr>
                <div class="renderBegin">Render Settings</div>
                ${bodyRender}
                <hr>
                ${bodyColor}
                <br>
            </div>
            `;
        var footer = `
    <div class="footer">
        <div class="action-btns">
            <button class="import action-btn">Import JSON</button>
            <button class="export action-btn">Export JSON</button>
            <button class="marketplace-btn action-btn" style="background:#768dfc; color:white; border:none;">Marketplace</button>
            <button class="lock-btn action-btn">Lock</button>
            <button class="reset-btn action-btn" style="background:#ff7979; color:white; border:none;">Reset</button>
        </div>
    </div>
`;
        var modalHTML = `
            <div id="ds-modal" class="ds-modal hide">
                <div class="ds-modal-content">
                    <span class="ds-close">&times;</span>
                    <h3 id="ds-modal-title">Import/Export</h3>
                    <p id="ds-modal-desc"></p>
                    <textarea id="ds-modal-text"></textarea>
                    <div class="ds-modal-footer">
                        <button id="ds-modal-action">Import</button>
                        <button id="ds-modal-copy">Copy to Clipboard</button>
                    </div>
                </div>
            </div>
        `;

        var msgModalHTML = `
            <div id="ds-msg-modal" class="ds-modal hide">
                <div class="ds-modal-content" style="max-width: 400px; text-align:center;">
                    <h3 id="ds-msg-title">Alert</h3>
                    <p id="ds-msg-text" style="font-size:1.1em; margin: 20px 0;"></p>
                    <div class="ds-modal-footer" style="display:flex; justify-content:center; gap:10px;">
                        <button id="ds-msg-cancel" style="background:#ff4757;">Cancel</button>
                        <button id="ds-msg-ok">OK</button>
                    </div>
                </div>
            </div>
        `;

        var marketModalHTML = `
    <div id="ds-market-modal" class="ds-modal hide">
        <div class="ds-modal-content" style="max-width: 700px; height: 600px; display:flex; flex-direction:column;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
                 <h3 style="margin-top:0;">Theme Marketplace (Upstash)</h3>
                 <span class="ds-close-market" style="font-size:28px; cursor:pointer;">&times;</span>
            </div>
            <div style="display:flex; gap:10px; margin-bottom:10px;">
                <button id="refreshMarketBtn" class="action-btn">Refresh List</button>
                <button id="openPublishModalBtn" class="action-btn" style="background:#00e16e; color:white; border:none;">Publish Theme</button>
            </div>
            <div id="market-list" style="flex:1; overflow-y:auto; border:1px solid var(--border-color); border-radius:4px; padding:10px; background: rgba(0,0,0,0.05);">
                 Loading...
            </div>
        </div>
    </div>
`;
        var publishModalHTML = `
    <div id="ds-publish-modal" class="ds-modal hide">
        <div class="ds-modal-content">
            <span class="ds-close-publish">&times;</span>
            <h3>Publish Theme</h3>
            <div class="form-group">
                <label>Author Name:</label>
                <input type="text" id="publishAuthor" placeholder="Anonymous">
            </div>
            <div class="form-group">
                <label>Theme Name:</label>
                <input type="text" id="publishName" placeholder="My Cool Theme">
            </div>
            <div class="form-group">
                 <label>Preview Image (Max 250KB):</label>
                 <input type="file" id="publishImageInput" accept="image/png, image/jpeg">
                 <div id="imagePreviewContainer" style="margin-top:5px; border:1px solid #ccc; min-height:50px; display:flex; align-items:center; justify-content:center; background:#eee;">
                     <span style="color:#888;">No image selected</span>
                     <img id="imagePreviewImg" style="max-width:100%; max-height:150px; display:none;">
                 </div>
            </div>
            <div class="ds-modal-footer" style="margin-top:15px;">
                 <button id="confirmPublishBtn" style="background:#00e16e;">Publish Now</button>
            </div>
        </div>
    </div>
`;

        const UPSTASH_URL = "https://actual-wasp-57164.upstash.io";
        const UPSTASH_TOKEN = "Ad9MAAIncDI1MjJlMzFkNzVmMTk0YjBmYmE0YjMyNDdmMWJkMmNhOXAyNTcxNjQ";
        const MARKET_KEY = "diep_marketplace_themes";

        var temp = `<div id="styleSetting">
${allBody} ${footer} </div> ${modalHTML} ${marketModalHTML} ${publishModalHTML} ${msgModalHTML}`;
        document.body.insertAdjacentHTML("beforeend", temp);
        addScript(jsColorPackage);

        staticListenerInit();

        function staticListenerInit() {
          // Dark Mode
          document.getElementById('darkModeToggle').addEventListener('change', function (e) {
            if (e.target.checked) {
              document.getElementById('styleSetting').classList.add('dark-mode');
              nowSetting.uiMode = 'dark';
            } else {
              document.getElementById('styleSetting').classList.remove('dark-mode');
              nowSetting.uiMode = 'light';
            }
            localStorage.pluginSave();
          });

          // Marketplace Buttons
          document.querySelector('.marketplace-btn').addEventListener('click', function () {
            document.getElementById('ds-market-modal').classList.remove('hide');
          });
          document.querySelector('.ds-close-market').addEventListener('click', function () {
            document.getElementById('ds-market-modal').classList.add('hide');
          });
          document.getElementById('refreshMarketBtn').addEventListener('click', loadMarketplace);
          document.getElementById('openPublishModalBtn').addEventListener('click', function () {
            document.getElementById('ds-market-modal').classList.add('hide');
            document.getElementById('ds-publish-modal').classList.remove('hide');
            document.getElementById('publishName').value = '';
            document.getElementById('publishImageInput').value = '';
            document.getElementById('imagePreviewImg').style.display = 'none';
            document.getElementById('imagePreviewContainer').querySelector('span').style.display = 'block';
          });
          document.querySelector('.ds-close-publish').addEventListener('click', function () {
            document.getElementById('ds-publish-modal').classList.add('hide');
          });

          // Image preview handling
          const fileInput = document.getElementById('publishImageInput');
          const previewImg = document.getElementById('imagePreviewImg');
          const previewPlaceholder = document.getElementById('imagePreviewContainer').querySelector('span');
          let currentBase64Image = null;
          fileInput.addEventListener('change', function (e) {
            const file = e.target.files[0];
            if (!file) return;

            if (file.size > 256000) { // 250KB limit roughly
              customAlert("Image too large. Please choose an image under 250KB.");
              fileInput.value = '';
              return;
            }

            const reader = new FileReader();
            reader.onloadend = function () {
              currentBase64Image = reader.result;
              previewImg.src = currentBase64Image;
              previewImg.style.display = 'block';
              previewPlaceholder.style.display = 'none';
            }
            reader.readAsDataURL(file);
          });

          document.getElementById('confirmPublishBtn').addEventListener('click', function () {
            var author = document.getElementById('publishAuthor').value || "Anonymous";
            var themeName = document.getElementById('publishName').value;
            if (!themeName) { customAlert("Please enter a theme name."); return; }

            publishTheme(themeName, author, currentBase64Image);
          });

           // Import/Export Modal Logic
          const modal = document.getElementById("ds-modal");
          const modalText = document.getElementById("ds-modal-text");
          const modalTitle = document.getElementById("ds-modal-title");
          const modalDesc = document.getElementById("ds-modal-desc");
          const importBtn = document.getElementById("ds-modal-action");
          const copyBtn = document.getElementById("ds-modal-copy");
          const closeSpan = document.querySelector(".ds-close");

          closeSpan.onclick = () => modal.classList.add("hide");

          document.querySelector("button.import").addEventListener("click", () => {
            modal.classList.remove("hide");
            modalTitle.innerText = "Import JSON";
            modalDesc.innerText = "Paste theme JSON code here to apply it immediately:";
            modalText.value = "";
            importBtn.style.display = "inline-block";
            copyBtn.style.display = "none";
            importBtn.onclick = () => {
                diepStyle.importJSON(modalText.value);
                modal.classList.add("hide");
                diepStyle.currentThemeId = null;
                refreshThemeListUI();
            };
          });
          document.querySelector("button.export").addEventListener("click", () => {
            modal.classList.remove("hide");
            modalTitle.innerText = "Export JSON";
            modalDesc.innerText = "Copy this code to share your current settings:";
            modalText.value = diepStyle.exportJSON("string");
            importBtn.style.display = "none";
            copyBtn.style.display = "inline-block";
            copyBtn.onclick = () => {
              modalText.select();
              document.execCommand("copy");
              copyBtn.innerText = "Copied!";
              setTimeout(() => copyBtn.innerText = "Copy to Clipboard", 1500);
            };
          });
          // Lock
          document.querySelector(".lock-btn").addEventListener("click", function () {
            nowSetting.lock = !nowSetting.lock;
            updateLockState();
          });
          // Reset
          const resetBtn = document.querySelector(".reset-btn");
          resetBtn.addEventListener("click", function (e) {
            if (e.target.innerHTML != "Confirm Reset") {
              e.target.innerHTML = "Confirm Reset";
            } else {
              diepStyle.storageInit("reset");
              diepStyle.resetColor();
              diepStyle.resetRender("reset");
              diepStyle.currentThemeId = null;
              refreshThemeListUI();
              e.target.innerHTML = "Reset";
            }
          });
          resetBtn.addEventListener("mouseleave", e => e.target.innerHTML = "Reset");

          // IMPORTANT: Bind Theme Listeners initially
          bindThemeActions();

          loadMarketplace();
        }

        // --- NEW: Function to bind listeners to the Theme UI whenever it's redrawn ---
        function bindThemeActions() {
          const saveBtn = document.getElementById('saveThemeBtn');
          if(saveBtn) {
              // Remove old listener if any (implicit via new DOM) and add new one
              saveBtn.onclick = function () {
                var name = document.getElementById('newThemeName').value;
                if (!name) { customAlert("Please enter a name for the new theme."); return; }
                var jsonObj = diepStyle.exportJSON("object");
                saveLocalTheme(name, jsonObj);
                diepStyle.currentThemeId = customThemes[customThemes.length - 1].id;
                updateOverwriteBtn();
              };
          }

          const overwriteBtn = document.getElementById('overwriteThemeBtn');
          if(overwriteBtn) {
              overwriteBtn.onclick = function () {
                if (!diepStyle.currentThemeId) return;
                const currentTheme = customThemes.find(t => t.id === diepStyle.currentThemeId);
                if (currentTheme) {
                     customConfirm(`Overwrite theme "${currentTheme.name}" with current settings?`, function() {
                          var jsonObj = diepStyle.exportJSON("object");
                          saveLocalTheme(currentTheme.name, jsonObj, diepStyle.currentThemeId);
                     });
                }
              };
          }

          const themeList = document.querySelector('.theme-list');
          if(themeList) {
              themeList.onclick = function (e) {
                // Load
                if (e.target.classList.contains('load-theme-btn')) {
                  var id = e.target.getAttribute('data-id');
                  var theme = customThemes.find(t => t.id == id);
                  if (theme) {
                    diepStyle.importJSON(theme.data);
                    diepStyle.currentThemeId = id;
                    refreshThemeListUI();
                  }
                }
                // Delete
                if (e.target.classList.contains('delete-theme-btn')) {
                  var id = e.target.getAttribute('data-id');
                  var idx = customThemes.findIndex(t => t.id == id);
                  if (idx !== -1) {
                      customConfirm("Are you sure you want to delete this theme?", function() {
                            customThemes.splice(idx, 1);
                            localStorage.setObject(THEME_KEY, customThemes);
                            if (diepStyle.currentThemeId == id) {
                              diepStyle.currentThemeId = null;
                            }
                            refreshThemeListUI();
                      });
                  }
                }
              };
          }
        }

        function loadMarketplace() {
          const list = document.getElementById('market-list');
          list.innerHTML = "Loading Themes from Marketplace...";

          fetch(`${UPSTASH_URL}/get/${MARKET_KEY}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${UPSTASH_TOKEN}`
            }
          })
            .then(response => response.json())
            .then(data => {
              let themes = [];
              if (data.result) {
                try {
                  themes = JSON.parse(data.result);
                } catch (e) {
                  console.error("Failed to parse Redis result:", e);
                  list.innerHTML = "Error parsing marketplace data.";
                  return;
                }
              }

              if (!Array.isArray(themes)) { themes = []; }

              if (themes.length === 0) {
                list.innerHTML = "No themes found in the marketplace. Be the first to publish!";
                return;
              }

              list.innerHTML = "";
              themes.slice().reverse().forEach((t, index) => {
                let card = document.createElement('div');
                card.className = "theme-card market-card";
                card.style.padding = "10px";
                card.style.marginBottom = "8px";
                card.style.background = "var(--modal-bg)";

                // Image handling
                let imgHTML = '';
                if (t.previewImage) {
                  imgHTML = `<img src="${t.previewImage}" style="width:60px; height:40px; object-fit:cover; border-radius:4px; border:1px solid var(--border-color); margin-right:10px;">`;
                } else {
                  imgHTML = `<div style="width:60px; height:40px; background:#eee; border-radius:4px; margin-right:10px; display:flex; align-items:center; justify-content:center; font-size:9px; color:#999;">No Preview</div>`
                }

                card.innerHTML = `
                          <div style="display:flex; flex:1; align-items:center;">
                              ${imgHTML}
                              <div>
                                  <div style="font-weight:bold; font-size:1.1em;">${escapeHtml(t.name)}</div>
                                  <div style="font-size:0.85em; opacity:0.7;">by ${escapeHtml(t.author)}</div>
                              </div>
                          </div>
                          <button class="load-market-btn action-btn" style="background:var(--accent-color); color:white; border:none; margin-left:10px;">Save to Local</button>
                      `;
                // Import listener
                card.querySelector('.load-market-btn').addEventListener('click', () => {
                  const saveName = prompt("Enter a name to save this theme locally:", t.name);
                  if (saveName) {
                    saveLocalTheme(saveName, t.data);
                    document.getElementById('ds-market-modal').classList.add('hide');
                    customAlert(`"${saveName}" saved to your local themes.`);
                  }
                });
                list.appendChild(card);
              });
            })
            .catch(err => {
              console.error(err);
              list.innerHTML = `<span style="color:red;">Error loading marketplace: ${err.message}</span>`;
            });
        }

        function publishTheme(name, author, base64Img) {
          const btn = document.getElementById('confirmPublishBtn');
          const originalText = btn.innerText;
          btn.innerText = "Publishing...";
          btn.disabled = true;
          fetch(`${UPSTASH_URL}/get/${MARKET_KEY}`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${UPSTASH_TOKEN}` }
          })
            .then(res => res.json())
            .then(data => {
              let currentThemes = [];
              if (data.result) {
                try { currentThemes = JSON.parse(data.result); } catch (e) { }
              }

              if (!Array.isArray(currentThemes)) currentThemes = [];
              let newTheme = {
                name: name,
                author: author,
                date: new Date().toISOString(),
                data: diepStyle.exportJSON("object"),
                previewImage: base64Img
              };
              currentThemes.push(newTheme);

              return fetch(`${UPSTASH_URL}`, {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${UPSTASH_TOKEN}`
                },
                body: JSON.stringify(["SET", MARKET_KEY, JSON.stringify(currentThemes)])
              });
            })
            .then(res => res.json())
            .then(result => {
              if (result.error) throw new Error(result.error);
              customAlert("Theme published successfully!");
              document.getElementById('ds-publish-modal').classList.add('hide');
              document.getElementById('ds-market-modal').classList.remove('hide');
              loadMarketplace(); // Refresh list
            })
            .catch(err => {
              customAlert("Failed to publish: " + err.message);
            })
            .finally(() => {
              btn.innerText = originalText;
              btn.disabled = false;
            });
        }
        function refreshThemeListUI() {
          var list = document.querySelector('.themeBody');
          if(!list) return;
          list.outerHTML = getThemeBody();
          // Call bindThemeActions again because the HTML was replaced
          bindThemeActions();
          updateOverwriteBtn();
        }
        function saveLocalTheme(name, themeDataObj, existingId = null) {
          if (existingId) {
            const idx = customThemes.findIndex(t => t.id == existingId);
            if (idx !== -1) {
              customThemes[idx].name = name;
              customThemes[idx].data = themeDataObj;
            }
          } else {
            customThemes.push({
              id: Date.now().toString(),
              name: name,
              data: themeDataObj
            });
          }
          localStorage.setObject(THEME_KEY, customThemes);
          refreshThemeListUI();
        }

        function updateLockState() {
          var lockBtn = document.querySelector(".lock-btn");
          var resetBtn = document.querySelector(".reset-btn");
          if (nowSetting.lock) {
            document.querySelector(".pluginBody").classList.add("locked-ui");
            lockBtn.innerHTML = "Locked";
            resetBtn.disabled = true;
          } else {
            document.querySelector(".pluginBody").classList.remove("locked-ui");
            lockBtn.innerHTML = "Lock";
            resetBtn.disabled = false;
          }
        }
        updateLockState();

        function bindRenderListeners() {
            const bindSlider = (name, selector, calc) => {
              const el = document.querySelector(`input[name=${name}]`);
              if (!el) return;
              const updateFill = (element) => {
                const val = element.value;
                const min = element.min ? element.min : 0;
                const max = element.max ? element.max : 100;
                const percentage = ((val - min) * 100) / (max - min);
                element.style.backgroundSize = percentage + "% 100%";
              };
              updateFill(el);
              el.addEventListener("input", function (e) {
                var value = calc(e.target.value);
                document.querySelector(selector).innerHTML = value;
                updateFill(e.target);
                diepStyle.command.fn(name, value);
              });
            };

            bindSlider("grid_base_alpha", ".grid_base_alpha_value", v => (v - (v % 2)) / 100);
            bindSlider("stroke_soft_color_intensity", ".stroke_soft_color_intensity_value", v => (v - (v % 5)) / 100);
            bindSlider("border_color_alpha", ".border_color_alpha_value", v => (v - (v % 2)) / 100);
            bindSlider("ui_scale", ".ui_scale_value", v => (v - (v % 2)) / 100);
            ["stroke_soft_color", "ui", "fps", "raw_health_values", "names"].forEach(name => {
              const el = document.querySelector(`input[name=${name}]`);
              if (el) el.addEventListener("change", e => diepStyle.command.fn(name, e.target.checked));
            });
        }
      }

      function loadColor() {
        nowSetting.colors.some(function (elem, th) {
          var target = document.querySelector(`.colorBlock${th}`);
          if (!target || !target.querySelector("input").jscolor) {
            setTimeout(loadColor, 500);
            return true;
          }
          onColor(elem.id, elem.color);
          target.querySelector("input").jscolor.fromString(elem.color);
        });
      }

      function exportJSON(mode = "string") {
        var array = [];
        nowSetting.colors.forEach(function (elem) {
          if (elem.id && elem.id < 50)
            array.push({ id: elem.id, value: elem.color, });
          if (elem.id && elem.id >= 50 && elem.id < 100)
            array.push({ cmd: elem.cmd, value: elem.color, });
        });
        array.push({
          cmd: "ui_replace_colors",
          value: diepStyle.uiColorMap("array"),
        });
        nowSetting.renders.forEach(function (elem) {
          array.push({ cmd: elem.cmd, value: elem.value, });
        });
        if (mode === "object") return array;
        return JSON.stringify(array);
      }

      function importJSON(jsonObj) {
        if (!jsonObj) { customAlert("Invalid data."); return; }
        var gotArr = jsonObj;
        if (typeof gotArr === 'string') {
          try {
            gotArr = JSON.parse(gotArr);
          } catch (e) { customAlert("Invalid JSON string"); return; }
        }

        gotArr.forEach(function (elem) {
          nowSetting.colors = nowSetting.colors.map(function (now) {
            if (elem.id && now.id == elem.id) now.color = elem.value;
            if (!elem.id && elem.cmd && now.cmd == elem.cmd)
              now.color = elem.value;
            return now;
          });
          nowSetting.renders = nowSetting.renders.map(function (now) {
            if (elem.cmd && now.cmd == elem.cmd) now.value = elem.value;
            return now;
          });
          if (elem.cmd == "ui_replace_colors") {
            var uiTH = nowSetting.colors.findIndex(
              (elem) => elem.name == "UI Color1"
            );
            for (var i = 0; i < 8; i++) {
              nowSetting.colors[uiTH + i].color = elem.value[i];
            }
          }
        });
        diepStyle.resetColor();
        diepStyle.resetRender();
        localStorage.pluginSave();
      }
    }

    function onColor(id, e) {
      var target = id;
      var color = e.toString();
      if (window.input) {
        if (id >= 0 && id < 50) {
          input.execute(`net_replace_color ${target} 0x${color}`);
        } else if (id >= 50 && id < 100) {
          var cmd = diepStyle.colorMap.get(id).cmd;
          input.set_convar(cmd, `0x${color}`);
        } else {
          input.execute("ui_replace_colors" + diepStyle.uiColorMap("0x"));
        }
      }
      nowSetting.colors = nowSetting.colors.map(function (elem) {
        if (elem.id === id) elem.color = color;
        return elem;
      });
    }

    function styleInit() {
      addGlobalStyle(`
        :root {
            --bg-color: rgba(245, 245, 245, 0.98);
            --text-color: #333;
            --border-color: #ccc;
            --accent-color: #00b1de;
            --btn-bg: #e0e0e0;
            --btn-hover: #d0d0d0;
            --modal-bg: #fff;
            --range-track: #ccc;
        }
        #styleSetting.dark-mode {
            --bg-color: rgba(30, 30, 35, 0.98);
            --text-color: #eee;
            --border-color: #555;
            --accent-color: #f14e54;
            --btn-bg: #444;
            --btn-hover: #555;
            --modal-bg: #2a2a2a;
            --range-track: #555;
        }
        #styleSetting {
            padding: 15px; position: absolute; top: 10px; right: 10px; width: 340px;
            background-color: var(--bg-color); color: var(--text-color); display: none;
            border: 1px solid var(--border-color); border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            height: 85vh;
            display: flex; flex-direction: column; font-family: 'Ubuntu', sans-serif; font-size: 12px; z-index: 9999;
        }
        .header-container { display: flex; justify-content: space-between; align-items: center;
        }
        .title { font-weight: bold; font-size: 1.3rem;
        }
        .subtitle { font-size: 0.8rem; color: #777; margin-bottom: 10px;
        }
        .pluginBody { flex-grow: 1; overflow-y: auto; padding-right: 5px;
        }
        .pluginBody.locked-ui { opacity: 0.6; pointer-events: none;
        }
        .row { display: flex; align-items: center; margin-bottom: 5px; padding: 2px 0;
        }
        .cell { flex: 1; } .label { flex: 2; font-weight: 500;
        }
        .value-display { text-align: right; padding-right: 10px; font-family: monospace;
        }
        .input-area { flex: 2; display: flex; align-items: center;
        }
        .check-area { justify-content: flex-end;
        }

        input[type=range] { -webkit-appearance: none; width: 100%; height: 12px; border-radius: 6px; background: var(--range-track);
        outline: none; background-image: linear-gradient(var(--accent-color), var(--accent-color)); background-repeat: no-repeat; background-size: 0% 100%; cursor: pointer;
        }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; height: 18px; width: 18px; border-radius: 50%; background: #ffffff;
        box-shadow: 0 1px 3px rgba(0,0,0,0.4); cursor: pointer; margin-top: -3px; transition: transform 0.1s;
        }
        input[type=range]::-webkit-slider-thumb:hover { transform: scale(1.1);
        }

        hr { border: 0; border-top: 1px solid var(--border-color); margin: 10px 0;
        }
        .section-title { font-weight: bold; margin-bottom: 8px; text-transform: uppercase; font-size: 0.85rem; color: var(--accent-color);
        }
        .color-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px;
        }
        .color-item { display: flex; align-items: center; justify-content: space-between; border: 1px solid var(--border-color);
        padding: 4px; border-radius: 4px; background: rgba(0,0,0,0.05); }
        input.jscolor { width: 60px; border: none;
        text-align: center; border-radius: 3px; cursor: pointer; }

        /* Themes */
        .theme-controls { display: flex;
        gap: 5px; margin-bottom: 10px; flex-wrap: wrap; }
        #newThemeName { flex: 2; padding: 5px;
        border: 1px solid var(--border-color); border-radius: 4px; background: var(--modal-bg); color: var(--text-color); min-width: 120px;
        }
        #saveThemeBtn, #overwriteThemeBtn { flex: 1; padding: 5px; cursor: pointer; background: var(--accent-color);
        color: white; border: none; border-radius: 4px; white-space: nowrap; }
        #overwriteThemeBtn { background: #f39c12;
        }
        #overwriteThemeBtn:disabled { background: var(--btn-bg); color: #999; cursor: not-allowed;
        }

        .theme-list { max-height: 200px; overflow-y: auto; border: 1px solid var(--border-color); border-radius: 4px;
        padding: 5px; }
        .theme-card { display: flex; justify-content: space-between; align-items: center; padding: 6px;
        border-bottom: 1px solid var(--border-color); }
        .theme-card.market-card:hover { background: rgba(0,0,0,0.05) !important;
        }
        .theme-name { font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-right: 10px;
        }
        .theme-actions button { font-size: 0.75rem; margin-left: 4px; cursor: pointer; border-radius: 3px;
        border: 1px solid var(--border-color); padding: 2px 6px; background: var(--btn-bg); color: var(--text-color);}
        .delete-theme-btn { color: white !important;
        background: #ff4757 !important; border: none !important; }
        .delete-theme-btn:hover { background: #e84118 !important;
        }

        /* Footer & Buttons */
        .footer { margin-top: 10px;
        padding-top: 10px; border-top: 1px solid var(--border-color); }
        .action-btns { display: flex; justify-content: space-between;
        gap: 5px; flex-wrap: wrap; }
        .action-btn { flex: 1 1 30%; padding: 8px;
        cursor: pointer; background: var(--btn-bg); color: var(--text-color); border: 1px solid var(--border-color); border-radius: 4px; font-size: 0.9rem; white-space: nowrap;
        }
        .reset-btn:hover { background: #ff7979 !important;
        }

        /* Switch & Modal (Global) */
        .switch { position: relative;
        display: inline-block; width: 34px; height: 18px; margin-right: 5px; }
        .switch input { opacity: 0;
        width: 0; height: 0; }
        .slider { position: absolute; cursor: pointer; top: 0;
        left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 34px;
        }
        .slider:before { position: absolute; content: ""; height: 14px; width: 14px; left: 2px;
        bottom: 2px; background-color: white; transition: .4s; border-radius: 50%; }
        input:checked + .slider { background-color: var(--accent-color);
        }
        input:checked + .slider:before { transform: translateX(16px);
        }
        .toggle-container { display: flex; align-items: center; font-size: 0.8rem;
        }

        .hide { display: none !important;
        }
        .ds-modal { position: fixed; z-index: 10000; left: 0; top: 0; width: 100%;
        height: 100%; overflow: auto; background-color: rgba(0,0,0,0.5); backdrop-filter: blur(2px); display: flex; align-items: center; justify-content: center;
        }
        .ds-modal-content { background-color: var(--modal-bg); color: var(--text-color); margin: auto; padding: 20px;
        border: 1px solid var(--border-color); width: 90%; max-width: 500px; border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        }
        .ds-close, .ds-close-market, .ds-close-publish { color: #aaa; float: right; font-size: 28px; font-weight: bold;
        cursor: pointer; line-height: 20px;}
        .ds-close:hover, .ds-close-publish:hover { color: var(--text-color);
        }
        #ds-modal-text { width: 100%; height: 150px; margin: 10px 0; padding: 5px;
        background: var(--btn-bg); color: var(--text-color); border: 1px solid var(--border-color); border-radius: 4px; resize: vertical; font-family: monospace; font-size: 0.8rem;
        }
        .ds-modal-footer { text-align: right;
        margin-top: 15px;}
        .ds-modal-footer button { padding: 8px 16px; background: var(--accent-color); color: white;
        border: none; border-radius: 4px; cursor: pointer; font-size: 1rem; margin-left: 5px;}
        .form-group { margin-bottom: 10px;
        } .form-group label { display: block; margin-bottom: 5px; font-weight: bold; } .form-group input[type=text], .form-group input[type=file] { width: 100%; padding: 8px;
        border: 1px solid var(--border-color); border-radius: 4px; background: var(--btn-bg); color: var(--text-color); }
      `);
      function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName("head")[0];
        if (!head) { return;
        }
        style = document.createElement("style");
        style.type = "text/css";
        style.innerHTML = css;
        head.appendChild(style);
      }
    }
  }

  function togglePanel(tf) {
    var el = document.querySelector("#styleSetting");
    if (el) el.style.display = tf ? "flex" : "none";
  }

  function addScript(src) {
    var s = document.createElement("script");
    s.setAttribute("src", src);
    document.body.appendChild(s);
  };
})();
