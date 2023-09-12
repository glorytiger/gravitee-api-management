/*
 * Copyright © 2015 The Gravitee team (http://gravitee.io)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package architecture;

import static com.tngtech.archunit.base.DescribedPredicate.not;
import static com.tngtech.archunit.core.domain.JavaClass.Predicates.resideInAPackage;
import static com.tngtech.archunit.core.domain.JavaClass.Predicates.resideInAnyPackage;
import static com.tngtech.archunit.lang.conditions.ArchConditions.haveNameMatching;
import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.classes;
import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noClasses;
import static com.tngtech.archunit.library.dependencies.SlicesRuleDefinition.slices;

import com.tngtech.archunit.base.DescribedPredicate;
import org.junit.jupiter.api.Test;

/**
 * @author Yann TAVERNIER (yann.tavernier at graviteesource.com)
 * @author GraviteeSource Team
 */
public class CoreRulesTest extends AbstractApimArchitectureTest {

    /**
     * Core package should be independent: it must not use anything from outside, except accepted libraries
     */
    @Test
    public void core_should_be_independent() {
        classes()
            .that()
            .resideInAPackage(anyPackageThatContains(GRAVITEE_APIM_PACKAGE + "." + CORE_PACKAGE + ".(**)"))
            .should()
            .onlyDependOnClassesThat(
                resideInAnyPackage(
                    anyPackageThatContains(GRAVITEE_APIM_PACKAGE + "." + CORE_PACKAGE + ".(**)"),
                    "java..",
                    "org.slf4j..",
                    "lombok..",
                    // TODO: ideally, core should be independent from model.
                    "io.gravitee.rest.api.model..",
                    // Common and Exceptions are an accepted case of reusability
                    "io.gravitee.rest.api.service.common..",
                    "io.gravitee.rest.api.service.exceptions.."
                )
            )
            .because("Core should be free from framework")
            .check(apimClassesWithoutTests());
    }
}