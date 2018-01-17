import { Directive, Input, ElementRef, Renderer, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { KeyValueChanges, KeyValueDiffer, KeyValueDiffers } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';
import { DataConnectorService } from '../service/data-connector.service';
import { Metadata } from '../classes/class-definitions';
@Directive({
  selector: '[appMetadataLabelByLanguage]'
})
export class MetadataLabelByLanguageDirective implements OnChanges, OnDestroy {
  @Input() metadata: Array<Metadata>;
  @Input() labelbinding: any = null;
  @Input() fallback:string="";
  private langChangeSubscriber;
  constructor(private translate: TranslateService, private el: ElementRef, private renderer: Renderer, private dataService: DataConnectorService, private differs: KeyValueDiffers) {
    this.langChangeSubscriber = translate.onLangChange.subscribe(() => {
      this.setContent();
    })
    this.setContent();
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.metadata) {
      this.setContent();
    }
  }
  ngOnDestroy() {
    if (this.langChangeSubscriber) {
      this.langChangeSubscriber.unsubscribe();
    }
  }
  setHTMLContent(label: string) {
    this.renderer.setElementProperty(this.el.nativeElement, 'innerHTML', label);
    if (this.labelbinding) {
      this.labelbinding.Label = label;
    }
  }
  private metadataTagDiffer: KeyValueDiffer<string, any>;
  private metadataArrayDiffer: KeyValueDiffer<string, any>;
  private metadatatag: Metadata;
  ngDoCheck(): void {
    if (this.metadataTagDiffer) {
      const changes = this.metadataTagDiffer.diff(this.metadatatag);
      if (changes) {
        this.setHTMLContent(this.metadatatag.Label);
      }
    }
    if (this.metadataArrayDiffer) {
      const changes = this.metadataArrayDiffer.diff(this.metadata);
      if (changes) {
       this.setContent();
      }
    }
  }
  setContent() {
    if (this.metadata && this.metadata.length > 0) {
      this.metadatatag = this.dataService.getMetadataByLanguage(this.metadata);
      //update if Label changed
      this.metadataTagDiffer = this.differs.find(this.metadatatag).create();
      this.setHTMLContent(this.metadatatag.Label);
    } else if(this.metadata) {
       //update if MetadataArray changed
      this.metadataArrayDiffer = this.differs.find(this.metadata).create();
      if(this.fallback){
        this.setHTMLContent(this.fallback);
      }
    }
  }

}
